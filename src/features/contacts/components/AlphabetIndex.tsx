import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../../theme';

type AlphabetIndexProps = {
  letters: string[];
  onSelect: (sectionIndex: number) => void;
};

// Thanh chữ cái cạnh phải như danh bạ điện thoại: chạm một chữ để nhảy tới nhóm đó.
export function AlphabetIndex({ letters, onSelect }: AlphabetIndexProps) {
  return (
    <View style={styles.rail} pointerEvents="box-none">
      <View style={styles.track}>
        {letters.map((letter, index) => (
          <Pressable
            key={letter}
            accessibilityRole="button"
            accessibilityLabel={`Đến nhóm ${letter}`}
            hitSlop={{ left: 12, right: 6 }}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => onSelect(index)}
          >
            <Text style={styles.letter}>{letter}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 2,
    justifyContent: 'center',
  },
  track: {
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderWarm,
  },
  item: {
    width: 22,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  pressed: {
    backgroundColor: colors.primarySoft,
  },
  letter: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
});
