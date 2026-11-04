import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { subscribeUserChats } from '../services/chatService';
import { subscribeStatuses, type Status } from '../services/presenceService';
import { subscribeUsers, type UserProfile } from '../services/userService';
import type { Conversation, User } from '../types/models';
import { useAuth } from './AuthContext';

type ChatContextValue = {
  users: User[];
  usersLoaded: boolean;
  getUser: (id: string) => User | undefined;
  conversations: Conversation[];
  getConversation: (peerId: string) => Conversation | undefined;
  totalUnread: number;
  chatsLoaded: boolean;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { me } = useAuth();
  const myId = me?.id;
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [chats, setChats] = useState<Conversation[]>([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  useEffect(() => {
    if (!myId) {
      setProfiles({});
      setUsersLoaded(false);
      return;
    }
    return subscribeUsers(next => {
      setProfiles(next);
      setUsersLoaded(true);
    });
  }, [myId]);

  useEffect(() => {
    if (!myId) {
      setStatuses({});
      return;
    }
    return subscribeStatuses(setStatuses);
  }, [myId]);

  useEffect(() => {
    if (!myId) {
      setChats([]);
      setChatsLoaded(false);
      return;
    }
    return subscribeUserChats(myId, next => {
      setChats(next);
      setChatsLoaded(true);
    });
  }, [myId]);

  const allUsers = useMemo(
    () =>
      Object.entries(profiles).map(([id, profile]): User => {
        const status = statuses[id];
        return {
          id,
          name: profile.name,
          isOnline: status?.online === true,
          lastSeen: status?.lastChanged ?? null,
        };
      }),
    [profiles, statuses],
  );

  const users = useMemo(
    () => allUsers.filter(user => user.id !== myId),
    [allUsers, myId],
  );

  const conversations = useMemo(
    () => [...chats].sort((a, b) => b.lastTime - a.lastTime),
    [chats],
  );

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unread, 0),
    [conversations],
  );

  const getUser = useCallback(
    (id: string) => users.find(user => user.id === id),
    [users],
  );

  const getConversation = useCallback(
    (peerId: string) => conversations.find(c => c.peerId === peerId),
    [conversations],
  );

  const value = useMemo(
    () => ({
      users,
      usersLoaded,
      getUser,
      conversations,
      getConversation,
      totalUnread,
      chatsLoaded,
    }),
    [
      users,
      usersLoaded,
      getUser,
      conversations,
      getConversation,
      totalUnread,
      chatsLoaded,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const value = useContext(ChatContext);
  if (!value) {
    throw new Error('useChat must be used inside ChatProvider');
  }
  return value;
}
