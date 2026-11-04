import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Icon } from './Icon';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Icon
        name="search"
        size={18}
        color={focused ? colors.primary : colors.textMuted}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Ô tìm kiếm"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value !== '' && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Xoá tìm kiếm"
          hitSlop={10}
          style={styles.clear}
          onPress={() => onChangeText('')}
        >
          <Icon name="close" size={14} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderWarm,
    height: 48,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  focused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMist,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
  clear: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
