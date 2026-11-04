import { useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motion } from '../theme';

type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  scaleTo?: number;
};

// Phản hồi chạm: co nhẹ khi nhấn (native driver). Giảm chuyển động -> đổi độ mờ.
export function PressableScale({
  style,
  children,
  scaleTo = motion.pressScale,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const reduced = useReducedMotion();
  const pressed = useRef(new Animated.Value(0)).current;

  const animateTo = (value: number) =>
    Animated.timing(pressed, {
      toValue: value,
      duration: value === 1 ? motion.fast / 2 : motion.fast,
      useNativeDriver: true,
    }).start();

  const transform = reduced
    ? undefined
    : [
        {
          scale: pressed.interpolate({
            inputRange: [0, 1],
            outputRange: [1, scaleTo],
          }),
        },
      ];
  const opacity = pressed.interpolate({
    inputRange: [0, 1],
    outputRange: [1, reduced ? 0.6 : 0.92],
  });

  return (
    <Pressable
      {...rest}
      onPressIn={event => {
        animateTo(1);
        onPressIn?.(event);
      }}
      onPressOut={event => {
        animateTo(0);
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, { opacity, transform }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
