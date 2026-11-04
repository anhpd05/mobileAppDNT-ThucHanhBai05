import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { PulseDot } from './PulseDot';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  // Chip số đếm cạnh tiêu đề, ví dụ tổng số liên hệ.
  badge?: string;
  // Hiện chấm trước phụ đề khi phụ đề là trạng thái realtime.
  live?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  right,
  badge,
  live = false,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <View style={styles.titleRow}>
          <Text style={typography.screenTitle} accessibilityRole="header">
            {title}
          </Text>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {subtitle ? (
          <View style={styles.subtitleRow}>
            {live && <PulseDot size={8} />}
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  texts: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    minWidth: 28,
    height: 24,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderBottomLeftRadius: radius.tail,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.numeric,
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  subtitle: {
    ...typography.caption,
  },
});
