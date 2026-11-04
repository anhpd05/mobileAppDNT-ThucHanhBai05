import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from '../components/Icon';
import { useChat } from '../context/ChatContext';
import { useNotifications } from '../context/NotificationContext';
import { HomeScreen } from '../features/chats/HomeScreen';
import { ContactsScreen } from '../features/contacts/ContactsScreen';
import { NotificationsScreen } from '../features/notifications/NotificationsScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { colors, radius } from '../theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab đang chọn: icon nằm trong nền teal nhạt.
function renderTabIcon(name: IconName) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <View style={[styles.pill, focused && styles.pillActive]}>
      <Icon name={name} color={color} size={22} />
    </View>
  );
}

function badge(count: number) {
  return count > 0 ? count : undefined;
}

export function MainTabs() {
  const { totalUnread } = useChat();
  const { unreadCount, enabled } = useNotifications();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.label,
        tabBarBadgeStyle: styles.badge,
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={HomeScreen}
        options={{
          title: 'Tin nhắn',
          tabBarIcon: renderTabIcon('chat'),
          tabBarBadge: badge(totalUnread),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ title: 'Danh bạ', tabBarIcon: renderTabIcon('users') }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarIcon: renderTabIcon('bell'),
          tabBarBadge: enabled ? badge(unreadCount) : undefined,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Cài đặt', tabBarIcon: renderTabIcon('settings') }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.card,
    borderTopColor: colors.borderWarm,
  },
  item: {
    paddingTop: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.danger,
    fontSize: 11,
    fontWeight: '800',
  },
  pill: {
    width: 56,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.primarySoft,
    borderBottomRightRadius: radius.tail,
  },
});
