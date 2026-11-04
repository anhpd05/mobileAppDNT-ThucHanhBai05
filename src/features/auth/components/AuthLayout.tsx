import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../../components/Icon';
import { SignalBackdrop } from '../../../components/SignalBackdrop';
import { colors, radius, shadowGlow, spacing } from '../../../theme';

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <SignalBackdrop
              originX={0.88}
              originY={0.22}
              radii={[60, 110, 160]}
              beacon
            />
            <View style={styles.bubbleBig}>
              <Icon name="chat" size={30} color={colors.primary} />
            </View>
            <Text style={styles.appName} accessibilityRole="header">
              ChatApp
            </Text>
            <Text style={styles.subtitle}>
              Nhắn tin nhanh, gọn, không quảng cáo
            </Text>
          </View>

          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{title}</Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthFormError({ message }: { message: string }) {
  return message ? <Text style={styles.formError}>{message}</Text> : null;
}

type AuthButtonProps = {
  label: string;
  loading: boolean;
  onPress: () => void;
};

export function AuthButton({ label, loading, onPress }: AuthButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: loading }}
      style={[styles.button, loading && styles.buttonLoading]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

type AuthSwitchLinkProps = {
  prompt: string;
  action: string;
  onPress: () => void;
};

export function AuthSwitchLink({
  prompt,
  action,
  onPress,
}: AuthSwitchLinkProps) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchText}>{prompt} </Text>
      <TouchableOpacity accessibilityRole="link" hitSlop={8} onPress={onPress}>
        <Text style={styles.switchAction}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  bubbleBig: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderBottomLeftRadius: radius.tail,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textOnPrimary,
    marginTop: spacing.lg,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textOnPrimaryMuted,
    marginTop: spacing.xs,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.sm,
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  formError: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 26,
    borderBottomRightRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    ...shadowGlow,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  switchText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  switchAction: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
