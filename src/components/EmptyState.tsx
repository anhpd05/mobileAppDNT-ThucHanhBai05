import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { colors, radius, spacing, typography } from '../theme';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
};

// Minh hoạ hai bong bóng chat (đúng chữ ký "góc bong bóng") + huy hiệu icon ngữ cảnh.
function Illustration({ icon }: { icon: IconName }) {
  return (
    <View style={styles.art}>
      <Svg width={160} height={112} viewBox="0 0 160 112">
        <Ellipse cx={80} cy={62} rx={72} ry={48} fill={colors.primarySoft} />
        <Path
          d="M42 26 H74 A20 20 0 0 1 94 46 V54 A20 20 0 0 1 74 74 H26 A4 4 0 0 1 22 70 V46 A20 20 0 0 1 42 26 Z"
          fill={colors.card}
          stroke={colors.borderWarm}
          strokeWidth={1.5}
        />
        <Rect
          x={34}
          y={40}
          width={40}
          height={6}
          rx={3}
          fill={colors.surfaceMuted}
        />
        <Rect
          x={34}
          y={52}
          width={26}
          height={6}
          rx={3}
          fill={colors.surfaceMuted}
        />
        <Path
          d="M86 50 H120 A20 20 0 0 1 140 70 V92 A4 4 0 0 1 136 96 H86 A20 20 0 0 1 66 76 V70 A20 20 0 0 1 86 50 Z"
          fill={colors.primary}
        />
        <Circle cx={91} cy={73} r={4} fill={colors.white} />
        <Circle cx={103} cy={73} r={4} fill={colors.white} opacity={0.75} />
        <Circle cx={115} cy={73} r={4} fill={colors.white} opacity={0.5} />
        <Circle cx={150} cy={58} r={4} fill={colors.warm} />
        <Circle cx={14} cy={90} r={3.5} fill={colors.primaryBright} />
        <Circle cx={30} cy={14} r={2.5} fill={colors.warm} />
      </Svg>
      <View style={styles.iconBadge}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
    </View>
  );
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Illustration icon={icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action ? (
        <PressableScale
          accessibilityRole="button"
          style={styles.action}
          onPress={action.onPress}
        >
          <Text style={styles.actionText}>{action.label}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  art: {
    width: 160,
    height: 112,
  },
  iconBadge: {
    position: 'absolute',
    top: 4,
    left: 104,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderBottomLeftRadius: radius.tail,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.name,
    fontSize: 17,
    fontWeight: '700',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  action: {
    marginTop: spacing.lg,
    minHeight: 44,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    borderBottomRightRadius: radius.tail,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
