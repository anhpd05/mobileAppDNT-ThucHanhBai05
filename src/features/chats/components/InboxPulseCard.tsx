import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../../components/Icon';
import { PressableScale } from '../../../components/PressableScale';
import { PulseDot } from '../../../components/PulseDot';
import { SignalBackdrop } from '../../../components/SignalBackdrop';
import {
  colors,
  radius,
  shadowGlow,
  spacing,
  typography,
} from '../../../theme';

type InboxPulseCardProps = {
  totalUnread: number;
  unreadChats: number;
  onlineCount: number;
  // Có khi còn tin chưa đọc: mở thẳng cuộc trò chuyện chưa đọc mới nhất.
  onOpenLatestUnread?: () => void;
};

// Thẻ "nhịp hộp thư": tóm tắt realtime số tin chưa đọc + số người online.
export function InboxPulseCard({
  totalUnread,
  unreadChats,
  onlineCount,
  onOpenLatestUnread,
}: InboxPulseCardProps) {
  const hasUnread = totalUnread > 0;

  return (
    <View style={styles.card}>
      <SignalBackdrop originX={1} originY={0} radii={[56, 92, 128]} />

      <View style={styles.topRow}>
        <Text style={styles.overline}>Nhịp hộp thư</Text>
        <View
          style={styles.liveChip}
          accessible
          accessibilityLabel={`${onlineCount} người đang hoạt động`}
        >
          <PulseDot
            size={7}
            color={onlineCount > 0 ? colors.online : colors.offline}
          />
          <Text style={styles.liveText}>{onlineCount} online</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.summary} accessible>
          {hasUnread ? (
            <View style={styles.countRow}>
              <Text style={styles.count}>{totalUnread}</Text>
              <Text style={styles.countLabel}>tin chưa đọc</Text>
            </View>
          ) : (
            <View style={styles.countRow}>
              <View style={styles.doneIcon}>
                <Icon name="check" size={18} color={colors.primary} />
              </View>
              <Text style={styles.doneTitle}>Đã đọc hết</Text>
            </View>
          )}
          <Text style={styles.caption}>
            {hasUnread
              ? `từ ${unreadChats} cuộc trò chuyện`
              : 'Hộp thư gọn gàng — nhắn cho ai đó nhé!'}
          </Text>
        </View>
        {hasUnread && onOpenLatestUnread ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Đọc tin chưa đọc mới nhất"
            style={styles.cta}
            onPress={onOpenLatestUnread}
          >
            <Text style={styles.ctaText}>Đọc ngay</Text>
            <Icon name="send" size={14} color={colors.primary} />
          </PressableScale>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    borderBottomLeftRadius: radius.tail,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    ...shadowGlow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overline: {
    ...typography.overline,
    color: colors.textOnPrimaryMuted,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.glassOnPrimary,
  },
  liveText: {
    ...typography.numeric,
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  summary: {
    flex: 1,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  count: {
    ...typography.numeric,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    color: colors.textOnPrimary,
    letterSpacing: -1,
  },
  countLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
    marginTop: 8,
  },
  doneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderBottomLeftRadius: radius.tail,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textOnPrimary,
    letterSpacing: -0.3,
  },
  caption: {
    fontSize: 13,
    color: colors.textOnPrimaryMuted,
    marginTop: 4,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderBottomRightRadius: radius.tail,
    backgroundColor: colors.white,
  },
  ctaText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
