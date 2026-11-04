import {
  increment,
  limitToLast,
  onChildAdded,
  onChildRemoved,
  onValue,
  push,
  query,
  ref,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import type { DataSnapshot } from 'firebase/database';
import type {
  Conversation,
  GeoPoint,
  Message,
  Unsubscribe,
} from '../types/models';
import { db } from './firebase';

type Payload =
  | { type: 'text'; text: string }
  | { type: 'location'; location: GeoPoint };

const MESSAGE_LIMIT = 200;
const LOCATION_PREVIEW = '📍 Vị trí';

export function getChatId(a: string, b: string): string {
  return [a, b].sort().join('_');
}

// Một update() đa đường dẫn = atomic: tin nhắn + hai bản ghi userChats cùng thành công hoặc cùng thất bại.
async function send(
  me: string,
  peer: string,
  payload: Payload,
  preview: string,
): Promise<void> {
  const chatId = getChatId(me, peer);
  const key = push(ref(db, 'messages/' + chatId)).key;
  if (!key) {
    throw new Error('Không tạo được khoá tin nhắn');
  }
  const mine = 'userChats/' + me + '/' + peer;
  const theirs = 'userChats/' + peer + '/' + me;
  await update(ref(db), {
    ['messages/' + chatId + '/' + key]: {
      from: me,
      ...payload,
      createdAt: serverTimestamp(),
    },
    [mine + '/lastMessage']: preview,
    [mine + '/lastTime']: serverTimestamp(),
    [mine + '/lastFrom']: me,
    [theirs + '/lastMessage']: preview,
    [theirs + '/lastTime']: serverTimestamp(),
    [theirs + '/lastFrom']: me,
    [theirs + '/unread']: increment(1),
  });
}

export function sendText(me: string, peer: string, text: string): Promise<void> {
  const body = text.trim();
  if (!body) {
    return Promise.resolve();
  }
  return send(me, peer, { type: 'text', text: body }, body);
}

export function sendLocation(
  me: string,
  peer: string,
  point: GeoPoint,
): Promise<void> {
  return send(
    me,
    peer,
    { type: 'location', location: { lat: point.lat, lng: point.lng } },
    LOCATION_PREVIEW,
  );
}

function parseMessage(snap: DataSnapshot): Message | null {
  const v = snap.val();
  if (!snap.key || !v || typeof v.from !== 'string') {
    return null;
  }
  if (typeof v.createdAt !== 'number') {
    return null;
  }
  const base = { id: snap.key, senderId: v.from, createdAt: v.createdAt };
  if (v.type === 'text' && typeof v.text === 'string') {
    return { ...base, type: 'text', text: v.text };
  }
  if (
    v.type === 'location' &&
    typeof v.location?.lat === 'number' &&
    typeof v.location?.lng === 'number'
  ) {
    return {
      ...base,
      type: 'location',
      location: { lat: v.location.lat, lng: v.location.lng },
    };
  }
  return null;
}

// onChildRemoved chạy khi server từ chối một tin đã hiện tạm (optimistic) → caller xoá bong bóng "ma".
export function subscribeMessages(
  chatId: string,
  handlers: { onAdd: (message: Message) => void; onRemove: (id: string) => void },
): Unsubscribe {
  const q = query(ref(db, 'messages/' + chatId), limitToLast(MESSAGE_LIMIT));
  const offAdded = onChildAdded(q, snap => {
    const message = parseMessage(snap);
    if (message) {
      handlers.onAdd(message);
    }
  });
  const offRemoved = onChildRemoved(q, snap => {
    if (snap.key) {
      handlers.onRemove(snap.key);
    }
  });
  return () => {
    offAdded();
    offRemoved();
  };
}

export function subscribeUserChats(
  uid: string,
  cb: (conversations: Conversation[]) => void,
): Unsubscribe {
  return onValue(
    ref(db, 'userChats/' + uid),
    snap => {
      const list: Conversation[] = [];
      snap.forEach(child => {
        const v = child.val();
        if (!child.key || typeof v?.lastTime !== 'number') {
          return;
        }
        list.push({
          peerId: child.key,
          lastMessage: typeof v.lastMessage === 'string' ? v.lastMessage : '',
          lastTime: v.lastTime,
          lastFrom: typeof v.lastFrom === 'string' ? v.lastFrom : '',
          // Entry phía người gửi không có `unread` → mặc định 0.
          unread: typeof v.unread === 'number' ? v.unread : 0,
        });
      });
      cb(list);
    },
    () => cb([]),
  );
}

export function markRead(me: string, peer: string): Promise<void> {
  return set(ref(db, 'userChats/' + me + '/' + peer + '/unread'), 0);
}
