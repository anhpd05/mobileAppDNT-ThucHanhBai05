import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../../../components/PressableScale';
import { colors, radius, spacing, typography } from '../../../theme';

export type FilterOption<K extends string> = {
  key: K;
  label: string;
  count: number;
};

type FilterChipsProps<K extends string> = {
  options: FilterOption<K>[];
  value: K;
  onChange: (key: K) => void;
};

export function FilterChips<K extends string>({
  options,
  value,
  onChange,
}: FilterChipsProps<K>) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {options.map(option => {
        const selected = option.key === value;
        return (
          <PressableScale
            key={option.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label}, ${option.count}`}
            hitSlop={4}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onChange(option.key)}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
            <View style={[styles.count, selected && styles.countSelected]}>
              <Text
                style={[styles.countText, selected && styles.countTextSelected]}
              >
                {option.count}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingLeft: 14,
    paddingRight: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.borderWarm,
  },
  chipSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  labelSelected: {
    color: colors.white,
  },
  count: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countSelected: {
    backgroundColor: colors.primaryBright,
  },
  countText: {
    ...typography.numeric,
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },
  countTextSelected: {
    color: colors.text,
  },
});
