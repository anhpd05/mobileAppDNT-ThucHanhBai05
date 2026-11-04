import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { colors, radius, spacing } from '../theme';

type SkeletonListProps = {
  rows?: number;
  label: string;
};

const WIDTHS = ['62%', '48%', '70%', '55%', '40%', '66%'] as const;

// Khung chờ: các dòng giả khớp bố cục dòng thật, mờ/rõ luân phiên.
export function SkeletonList({ rows = 7, label }: SkeletonListProps) {
  const reduced = useReducedMotion();
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breath, reduced]);

  const opacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.45],
  });

  return (
    <Animated.View
      style={[styles.group, { opacity }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={i}
          style={[
            styles.row,
            i === 0 && styles.first,
            i === rows - 1 && styles.last,
          ]}
        >
          <View style={styles.avatar} />
          <View style={styles.lines}>
            <View style={[styles.line, { width: WIDTHS[i % WIDTHS.length] }]} />
            <View style={[styles.line, styles.lineShort]} />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginHorizontal: spacing.lg,
    gap: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  first: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  last: {
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.tail,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
  },
  lines: {
    flex: 1,
    gap: spacing.sm,
  },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceMuted,
  },
  lineShort: {
    width: '34%',
  },
});
