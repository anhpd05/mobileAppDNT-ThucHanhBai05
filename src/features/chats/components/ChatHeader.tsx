import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../../../components/Avatar';
import { Icon } from '../../../components/Icon';
import { colors, radius, spacing, typography } from '../../../theme';
import type { User } from '../../../types/models';
import { formatLastSeen } from '../../../utils/formatTime';

type ChatHeaderProps = {
  user: User;
  onBack: () => void;
};

export function ChatHeader({ user, onBack }: ChatHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
        hitSlop={4}
        style={styles.back}
        onPress={onBack}
      >
        <Icon name="back" size={24} />
      </TouchableOpacity>
      <Avatar
        name={user.name}
        seed={user.id}
        size={42}
        online={user.isOnline}
        pulse
      />
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1} accessibilityRole="header">
          {user.name}
        </Text>
        {user.isOnline ? (
          <Text style={[typography.caption, styles.online]}>
            Đang hoạt động
          </Text>
        ) : (
          <Text style={typography.caption}>
            {user.lastSeen ? formatLastSeen(user.lastSeen) : 'Ngoại tuyến'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingLeft: spacing.xs,
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderWarm,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  name: {
    ...typography.name,
    fontSize: 17,
    fontWeight: '700',
  },
  online: {
    color: colors.onlineText,
    fontWeight: '700',
  },
});
