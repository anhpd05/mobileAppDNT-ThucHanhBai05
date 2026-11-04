import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import type { RootStackScreenProps } from '../../navigation/types';
import {
  getChatId,
  markRead,
  sendLocation,
  sendText,
  subscribeMessages,
} from '../../services/chatService';
import {
  getCurrentLocation,
  LocationError,
} from '../../services/locationService';
import { colors, spacing, typography } from '../../theme';
import type { Message } from '../../types/models';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { MessageInput } from './components/MessageInput';

export function ChatDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<'ChatDetail'>) {
  const { peerId } = route.params;
  const { me } = useAuth();
  const { getUser, usersLoaded, getConversation } = useChat();
  const peer = getUser(peerId);
  const myId = me?.id;
  const chatId = myId ? getChatId(myId, peerId) : null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [locating, setLocating] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);
  const isFocused = useIsFocused();
  const unread = getConversation(peerId)?.unread ?? 0;

  useEffect(() => {
    setMessages([]);
    if (!chatId) {
      return;
    }
    // Cleanup hủy listener: vào/ra nhiều lần không bị lặp tin.
    return subscribeMessages(chatId, {
      onAdd: msg =>
        setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg])),
      onRemove: id => setMessages(prev => prev.filter(m => m.id !== id)),
    });
  }, [chatId]);

  useEffect(() => {
    if (myId && isFocused && unread > 0 && AppState.currentState === 'active') {
      markRead(myId, peerId).catch(() => {});
    }
  }, [isFocused, unread, myId, peerId]);

  const data = useMemo(() => [...messages].reverse(), [messages]);

  if (!myId) {
    return null;
  }

  if (!usersLoaded) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={styles.loading} color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!peer) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          icon="info"
          title="Không tìm thấy người dùng"
          message="Người dùng này không tồn tại."
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const scrollToLatest = () =>
    listRef.current?.scrollToOffset({ offset: 0, animated: true });

  const handleSend = (text: string) => {
    sendText(myId, peerId, text).catch(() =>
      Alert.alert('Không gửi được', 'Vui lòng thử lại.'),
    );
    scrollToLatest();
  };

  const handleSendLocation = async () => {
    setLocating(true);
    try {
      const point = await getCurrentLocation();
      await sendLocation(myId, peerId, point);
      scrollToLatest();
    } catch (error) {
      if (error instanceof LocationError) {
        if (error.code === 'denied') {
          Alert.alert(
            'Không có quyền vị trí',
            'Bạn đã từ chối quyền truy cập vị trí nên không thể gửi vị trí.',
          );
        } else if (error.code === 'blocked') {
          Alert.alert(
            'Không có quyền vị trí',
            'Hãy cấp quyền vị trí trong Cài đặt để gửi vị trí.',
            [
              { text: 'Huỷ', style: 'cancel' },
              { text: 'Mở cài đặt', onPress: () => Linking.openSettings() },
            ],
          );
        } else {
          Alert.alert('Không lấy được vị trí', 'Hãy bật GPS rồi thử lại.');
        }
      } else {
        Alert.alert('Không gửi được', 'Vui lòng thử lại.');
      }
    } finally {
      setLocating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ChatHeader user={peer} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        {data.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState
              icon="chat"
              title="Chưa có tin nhắn"
              message={`Hãy gửi lời chào tới ${peer.name}`}
            />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            inverted
            data={data}
            keyExtractor={m => m.id}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <MessageBubble message={item} isMine={item.senderId === myId} />
            )}
          />
        )}
        <MessageInput
          onSend={handleSend}
          onSendLocation={handleSendLocation}
          locating={locating}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  loading: {
    marginTop: 48,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  back: {
    ...typography.name,
    color: colors.primary,
    textAlign: 'center',
  },
});
