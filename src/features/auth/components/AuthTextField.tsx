import { useState, type Ref } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, type IconName } from '../../../components/Icon';
import { colors, radius, spacing, typography } from '../../../theme';

type AuthTextFieldProps = {
  label: string;
  icon: IconName;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  maxLength?: number;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  ref?: Ref<TextInputInstance>;
};

export function AuthTextField({
  label,
  icon,
  value,
  onChangeText,
  error,
  placeholder,
  secure = false,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
  maxLength,
  returnKeyType,
  onSubmitEditing,
  ref,
}: AuthTextFieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        <Icon
          name={icon}
          size={20}
          color={focused ? colors.primary : colors.textMuted}
        />
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secure && !visible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={`Ô ${label.toLowerCase()}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secure && (
          <TouchableOpacity
            accessibilityLabel={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            hitSlop={8}
            onPress={() => setVisible(prev => !prev)}
          >
            <Icon
              name={visible ? 'eye' : 'eyeOff'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.borderWarm,
    borderRadius: radius.md,
    borderBottomLeftRadius: radius.tail,
    height: 52,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMist,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
