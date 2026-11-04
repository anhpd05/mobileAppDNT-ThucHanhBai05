export type Unsubscribe = () => void;

export type Me = { id: string; name: string; email: string };

export type User = {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen: number | null;
};

export type GeoPoint = { lat: number; lng: number };

export type Message =
  | {
      id: string;
      senderId: string;
      type: 'text';
      text: string;
      createdAt: number;
    }
  | {
      id: string;
      senderId: string;
      type: 'location';
      location: GeoPoint;
      createdAt: number;
    };

export type Conversation = {
  peerId: string;
  lastMessage: string;
  lastTime: number;
  lastFrom: string;
  unread: number;
};

export type AppNotification = {
  id: string;
  type: 'message' | 'friend' | 'system';
  content: string;
  createdAt: string;
  read: boolean;
};
