import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { colors, motion } from '../theme';

type PulseDotProps = {
  size?: number;
  color?: string;
  borderColor?: string;
};

// Mô-típ "tín hiệu sống": chấm online phát sóng vòng tròn lan ra.
export function PulseDot({
  size = 10,
  color = colors.online,
  borderColor,
}: PulseDotProps) {
  const reduced = useReducedMotion();
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      wave.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(wave, {
        toValue: 1,
        duration: motion.pulse,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, wave]);

  const box = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={box}>
      {!reduced && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            box,
            {
              backgroundColor: color,
              opacity: wave.interpolate({
                inputRange: [0, 1],
                outputRange: [0.55, 0],
              }),
              transform: [
                {
                  scale: wave.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2.6],
                  }),
                },
              ],
            },
          ]}
        />
      )}
      <View
        style={[
          box,
          { backgroundColor: color },
          borderColor ? [styles.ring, { borderColor }] : null,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
  },
});
