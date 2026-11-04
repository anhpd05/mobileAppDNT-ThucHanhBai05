import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';

// Đường kẻ giữa các dòng trong một nhóm thẻ bo góc (lùi vào sau avatar).
export function InsetSeparator() {
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.card,
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 76,
  },
});
