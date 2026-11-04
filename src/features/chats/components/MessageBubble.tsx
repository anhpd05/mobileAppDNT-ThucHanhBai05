import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Icon } from '../../../components/Icon';
import { openInGoogleMaps } from '../../../services/locationService';
import { colors, radius, spacing, typography } from '../../../theme';
import type { Message } from '../../../types/models';
import { formatClock } from '../../../utils/formatTime';

type MessageBubbleProps = {
  message: Message;
  isMine: boolean;
};

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const align = isMine ? styles.alignMine : styles.alignOther;
  const time = formatClock(message.createdAt);

  if (message.type === 'location') {
    const { lat, lng } = message.location;
    return (
      <TouchableOpacity
        accessibilityRole="link"
        accessibilityLabel="Vị trí, nhấn để mở Google Maps"
        activeOpacity={0.8}
        style={[styles.locationCard, align]}
        onPress={() => openInGoogleMaps(message.location).catch(() => {})}
      >
        <View style={styles.mapPreview}>
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Path
              d="M0 30 H240 M0 60 H240 M60 0 V90 M120 0 V90 M180 0 V90"
              stroke={colors.white}
              strokeWidth={1}
              strokeOpacity={0.7}
            />
            <Path
              d="M-10 78 C 50 50, 90 70, 130 40 S 210 20, 250 10"
              stroke={colors.primaryBright}
              strokeWidth={3}
              strokeOpacity={0.45}
              fill="none"
            />
            <Circle
              cx="50%"
              cy="50%"
              r={24}
              fill={colors.primary}
              opacity={0.12}
            />
          </Svg>
          <View style={styles.pin}>
            <Icon name="mapPin" size={22} color={colors.white} />
          </View>
        </View>
        <View style={styles.locationBody}>
          <Text style={styles.locationTitle}>Vị trí hiện tại</Text>
          <Text style={styles.coords}>
            {`${lat.toFixed(5)}, ${lng.toFixed(5)}`}
          </Text>
          <View style={styles.locationFooter}>
            <Text style={styles.openMaps}>Nhấn để mở Google Maps</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.bubble, align, isMine ? styles.mine : styles.other]}>
      <Text style={[typography.body, isMine && styles.mineText]}>
        {message.text}
      </Text>
      <Text style={[styles.time, isMine && styles.mineMeta]}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alignMine: {
    alignSelf: 'flex-end',
  },
  alignOther: {
    alignSelf: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
  },
  mine: {
    backgroundColor: colors.bubbleMine,
    borderBottomRightRadius: radius.tail,
  },
  other: {
    backgroundColor: colors.bubbleOther,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    borderBottomLeftRadius: radius.tail,
  },
  mineText: {
    color: colors.bubbleMineText,
  },
  time: {
    ...typography.numeric,
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 2,
    color: colors.textMuted,
  },
  mineMeta: {
    color: colors.bubbleMineMeta,
  },
  locationCard: {
    width: 240,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    overflow: 'hidden',
  },
  mapPreview: {
    height: 90,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderBottomLeftRadius: radius.tail,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  locationTitle: {
    ...typography.name,
    fontSize: 15,
  },
  coords: {
    ...typography.caption,
    marginTop: 2,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  openMaps: {
    ...typography.caption,
    color: colors.primary,
  },
});
