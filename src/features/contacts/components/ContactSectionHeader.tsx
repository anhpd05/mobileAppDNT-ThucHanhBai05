import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';

type ContactSectionHeaderProps = {
  title: string;
  count: number;
};

// Tiêu đề nhóm: chữ cái, đường kẻ và số người trong nhóm.
export function ContactSectionHeader({
  title,
  count,
}: ContactSectionHeaderProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="header"
      accessibilityLabel={`Nhóm ${title}, ${count} người`}
    >
      <View style={styles.letterTile}>
        <Text style={styles.letter}>{title}</Text>
      </View>
      <View style={styles.rule} />
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  letterTile: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderBottomLeftRadius: 2,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderWarm,
  },
  count: {
    ...typography.caption,
    ...typography.numeric,
  },
});
