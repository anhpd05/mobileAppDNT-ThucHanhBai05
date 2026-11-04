import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motion } from '../theme';

type FadeInViewProps = {
  index?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

// Vào danh sách: mờ dần + trượt lên 8px, so le theo index (tối đa 8 mục đầu).
export function FadeInView({ index = 0, style, children }: FadeInViewProps) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: reduced ? 0 : motion.base,
      delay: reduced
        ? 0
        : Math.min(index, motion.maxStaggerItems) * motion.stagger,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
    // Chỉ chạy lúc mount: cập nhật realtime không được làm dòng nhấp nháy lại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <Animated.View
      style={[style, { opacity: progress, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  );
}
