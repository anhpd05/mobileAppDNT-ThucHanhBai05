import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../../components/Avatar';
import { HighlightText } from '../../../components/HighlightText';
import { Icon } from '../../../components/Icon';
import { PressableScale } from '../../../components/PressableScale';
import { colors, radius, spacing, typography } from '../../../theme';
import type { Conversation, User } from '../../../types/models';
import { formatTime } from '../../../utils/formatTime';
import { UnreadBadge } from './UnreadBadge';

// Trùng với chuỗi chatService ghi vào lastMessage khi gửi vị trí.
const LOCATION_PREVIEW = '📍 Vị trí';

type ConversationItemProps = {
  user: User;
  conversation: Conversation;
  isMine: boolean;
  onPress: () => void;
  query?: string;
  isFirst?: boolean;
  isLast?: boolean;
};

export function ConversationItem({
  user,
  conversation,
  isMine,
  onPress,
  query = '',
  isFirst = false,
  isLast = false,
}: ConversationItemProps) {
  const unread = conversation.unread;
  const hasUnread = unread > 0;
  const isLocation = conversation.lastMessage === LOCATION_PREVIEW;
  const preview = isLocation ? 'Đã chia sẻ vị trí' : conversation.lastMessage;
  const time = formatTime(conversation.lastTime);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={[
        `Trò chuyện với ${user.name}`,
        user.isOnline ? 'đang hoạt động' : null,
        hasUnread ? `${unread} tin chưa đọc` : null,
        `${isMine ? 'Bạn: ' : ''}${preview}`,
        time,
      ]
        .filter(Boolean)
        .join(', ')}
      scaleTo={0.985}
      style={[
        styles.row,
        hasUnread && styles.rowUnread,
        isFirst && styles.first,
        isLast && styles.last,
      ]}
      onPress={onPress}
    >
      {hasUnread && <View style={styles.signal} />}
      <Avatar
        name={user.name}
        seed={user.id}
        size={52}
        online={user.isOnline}
      />
      <View style={styles.middle}>
        <HighlightText
          text={user.name}
          query={query}
          style={[styles.name, hasUnread && styles.nameUnread]}
          numberOfLines={1}
        />
        <View style={styles.previewRow}>
          {isMine && <Text style={styles.mine}>Bạn: </Text>}
          {isLocation && (
            <View style={styles.pin}>
              <Icon name="mapPin" size={13} color={colors.primary} />
            </View>
          )}
          <HighlightText
            text={preview}
            query={isLocation ? '' : query}
            style={[styles.message, hasUnread && styles.messageUnread]}
            numberOfLines={1}
          />
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.time, hasUnread && styles.timeUnread]}>
          {time}
        </Text>
        <UnreadBadge count={unread} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    minHeight: 76,
  },
  rowUnread: {
    backgroundColor: colors.primaryMist,
  },
  first: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  last: {
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.tail,
  },
  signal: {
    position: 'absolute',
    left: 0,
    top: 18,
    bottom: 18,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.primary,
  },
  middle: {
    flex: 1,
  },
  name: {
    ...typography.name,
  },
  nameUnread: {
    fontWeight: '800',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  mine: {
    ...typography.bodyMuted,
    fontWeight: '600',
  },
  pin: {
    marginRight: 3,
  },
  message: {
    ...typography.bodyMuted,
    flexShrink: 1,
  },
  messageUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 6,
  },
  time: {
    ...typography.caption,
    ...typography.numeric,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '700',
  },
});
