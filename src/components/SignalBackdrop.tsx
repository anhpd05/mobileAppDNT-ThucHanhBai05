import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme';

type SignalBackdropProps = {
  // Tâm các vòng sóng, tính theo tỉ lệ khung (0..1).
  originX: number;
  originY: number;
  radii: number[];
  beacon?: boolean;
};

// Nền chữ ký: gradient teal + các vòng "sóng tín hiệu" mờ lan từ một điểm.
// Đo khung bằng onLayout vì Svg kích thước % không phủ kín khi khung đổi cỡ.
export function SignalBackdrop({
  originX,
  originY,
  radii,
  beacon = false,
}: SignalBackdropProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const cx = size.width * originX;
  const cy = size.height * originY;

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
      }}
    >
      {size.width > 0 && (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <LinearGradient id="signal" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.primary} />
              <Stop offset="1" stopColor={colors.primaryDeep} />
            </LinearGradient>
          </Defs>
          <Rect width={size.width} height={size.height} fill="url(#signal)" />
          {radii.map((r, i) => (
            <Circle
              key={r}
              cx={cx}
              cy={cy}
              r={r}
              stroke={colors.white}
              strokeOpacity={0.16 - i * 0.04}
              strokeWidth={1.5}
              fill="none"
            />
          ))}
          {beacon && <Circle cx={cx} cy={cy} r={6} fill={colors.warm} />}
        </Svg>
      )}
    </View>
  );
}
