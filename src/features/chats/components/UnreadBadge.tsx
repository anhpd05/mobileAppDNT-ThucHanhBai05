import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { colors, radius, typography } from '../../../theme';

type UnreadBadgeProps = {
  count: number;
};

export function UnreadBadge({ count }: UnreadBadgeProps) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const previous = useRef(count);

  // "Nảy" nhẹ mỗi khi có thêm tin chưa đọc theo realtime.
  useEffect(() => {
    const grew = count > previous.current;
    previous.current = count;
    if (!grew || reduced) {
      return;
    }
    scale.setValue(0.6);
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [count, reduced, scale]);

  if (count <= 0) {
    return null;
  }
  return (
    <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
      <Text style={styles.text}>{count > 99 ? '99+' : String(count)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: radius.md,
    borderBottomRightRadius: radius.tail - 2,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.numeric,
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
