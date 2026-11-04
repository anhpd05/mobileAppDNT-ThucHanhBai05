import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/EmptyState';
import { FadeInView } from '../../components/FadeInView';
import { InsetSeparator } from '../../components/InsetSeparator';
import { SearchBar } from '../../components/SearchBar';
import { SkeletonList } from '../../components/SkeletonList';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { MainTabScreenProps } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import type { Conversation, User } from '../../types/models';
import { ConversationItem } from './components/ConversationItem';
import { FilterChips, type FilterOption } from './components/FilterChips';
import { GreetingHeader } from './components/GreetingHeader';
import { InboxPulseCard } from './components/InboxPulseCard';
import { OnlineStrip } from './components/OnlineStrip';

type ConversationRow = {
  conversation: Conversation;
  peer: User;
};

type Filter = 'all' | 'unread' | 'online';

export function HomeScreen({ navigation }: MainTabScreenProps<'Chats'>) {
  const {
    conversations,
    totalUnread,
    getUser,
    users,
    usersLoaded,
    chatsLoaded,
  } = useChat();
  const { me, showOnline } = useAuth();
  const reduced = useReducedMotion();
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const allRows = useMemo(
    () =>
      conversations.flatMap((conversation): ConversationRow[] => {
        const peer = getUser(conversation.peerId);
        return peer ? [{ conversation, peer }] : [];
      }),
    [conversations, getUser],
  );

  const searchedRows = useMemo(() => {
    const needle = keyword.trim().toLowerCase();
    return allRows.filter(
      ({ conversation, peer }) =>
        !needle ||
        peer.name.toLowerCase().includes(needle) ||
        conversation.lastMessage.toLowerCase().includes(needle),
    );
  }, [allRows, keyword]);

  const unreadRows = searchedRows.filter(row => row.conversation.unread > 0);
  const onlineRows = searchedRows.filter(row => row.peer.isOnline);
  const rows =
    filter === 'unread'
      ? unreadRows
      : filter === 'online'
      ? onlineRows
      : searchedRows;

  // Người đang online: ưu tiên người vừa nhắn gần đây, sau đó theo tên.
  const onlineUsers = useMemo(() => {
    const recency = new Map(conversations.map((c, i) => [c.peerId, i]));
    return users
      .filter(user => user.isOnline)
      .sort(
        (a, b) =>
          (recency.get(a.id) ?? Infinity) - (recency.get(b.id) ?? Infinity) ||
          a.name.localeCompare(b.name, 'vi'),
      );
  }, [users, conversations]);

  const openChat = useCallback(
    (peerId: string) => navigation.navigate('ChatDetail', { peerId }),
    [navigation],
  );

  const changeFilter = (next: Filter) => {
    if (!reduced) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setFilter(next);
  };

  const latestUnread = allRows.find(row => row.conversation.unread > 0);
  const searching = keyword.trim() !== '';

  const filterOptions: FilterOption<Filter>[] = [
    { key: 'all', label: 'Tất cả', count: searchedRows.length },
    { key: 'unread', label: 'Chưa đọc', count: unreadRows.length },
    { key: 'online', label: 'Online', count: onlineRows.length },
  ];

  const listHeader = (
    <View>
      {!searching && (
        <InboxPulseCard
          totalUnread={totalUnread}
          unreadChats={
            allRows.filter(row => row.conversation.unread > 0).length
          }
          onlineCount={onlineUsers.length}
          onOpenLatestUnread={
            latestUnread ? () => openChat(latestUnread.peer.id) : undefined
          }
        />
      )}
      {!searching && onlineUsers.length > 0 && (
        <OnlineStrip users={onlineUsers} onOpen={openChat} />
      )}
      {allRows.length > 0 && (
        <FilterChips
          options={filterOptions}
          value={filter}
          onChange={changeFilter}
        />
      )}
      {searching && rows.length > 0 && (
        <Text style={styles.resultCount}>
          {`${rows.length} cuộc trò chuyện khớp “${keyword.trim()}”`}
        </Text>
      )}
    </View>
  );

  const emptyState =
    allRows.length === 0 ? (
      <EmptyState
        icon="chat"
        title="Chưa có cuộc trò chuyện"
        message="Chọn một người trong Danh bạ để bắt đầu nhắn tin."
        action={{
          label: 'Mở Danh bạ',
          onPress: () => navigation.navigate('Contacts'),
        }}
      />
    ) : searching && searchedRows.length === 0 ? (
      <EmptyState
        icon="search"
        title="Không tìm thấy"
        message="Không có cuộc trò chuyện nào khớp với từ khoá."
      />
    ) : filter === 'unread' ? (
      <EmptyState
        icon="check"
        title="Không còn tin chưa đọc"
        message="Bạn đã đọc hết tin nhắn."
        action={{ label: 'Xem tất cả', onPress: () => changeFilter('all') }}
      />
    ) : (
      <EmptyState
        icon="users"
        title="Chưa ai đang online"
        message="Cuộc trò chuyện có người đang hoạt động sẽ hiện ở đây."
        action={{ label: 'Xem tất cả', onPress: () => changeFilter('all') }}
      />
    );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {me ? (
        <GreetingHeader
          me={me}
          online={showOnline}
          onPressProfile={() => navigation.navigate('Settings')}
        />
      ) : null}
      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm người hoặc nội dung tin nhắn"
      />
      {chatsLoaded && usersLoaded ? (
        <FlatList
          data={rows}
          keyExtractor={row => row.conversation.peerId}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={InsetSeparator}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          renderItem={({ item: row, index }) => (
            <FadeInView index={index}>
              <ConversationItem
                user={row.peer}
                conversation={row.conversation}
                isMine={row.conversation.lastFrom === me?.id}
                query={keyword}
                isFirst={index === 0}
                isLast={index === rows.length - 1}
                onPress={() => openChat(row.peer.id)}
              />
            </FadeInView>
          )}
          ListEmptyComponent={emptyState}
        />
      ) : (
        <SkeletonList label="Đang tải cuộc trò chuyện" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  resultCount: {
    ...typography.caption,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
});
