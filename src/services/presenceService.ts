import {
  goOffline,
  goOnline,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from 'firebase/database';
import type { Unsubscribe } from '../types/models';
import { db } from './firebase';

export type Status = { online: boolean; lastChanged: number };

const statusRef = (uid: string) => ref(db, 'status/' + uid);
const offlineValue = () => ({ online: false, lastChanged: serverTimestamp() });

// Mẫu `.info/connected` chính thức. `visible = false` → luôn ghi offline, không ghi online.
// Presence là best-effort nên lỗi ghi bị nuốt để không thành unhandled rejection.
export function startPresence(uid: string, visible: boolean): Unsubscribe {
  return onValue(ref(db, '.info/connected'), snap => {
    if (snap.val() !== true) {
      return;
    }
    if (!visible) {
      set(statusRef(uid), offlineValue()).catch(() => {});
      return;
    }
    onDisconnect(statusRef(uid))
      .set(offlineValue())
      .then(() =>
        set(statusRef(uid), { online: true, lastChanged: serverTimestamp() }),
      )
      .catch(() => {});
  });
}

export function setOffline(uid: string): Promise<void> {
  return set(statusRef(uid), offlineValue());
}

export function pauseConnection(): void {
  goOffline(db);
}

export function resumeConnection(): void {
  goOnline(db);
}

export function subscribeStatuses(
  cb: (statuses: Record<string, Status>) => void,
): Unsubscribe {
  return onValue(
    ref(db, 'status'),
    snap => cb(snap.val() ?? {}),
    () => cb({}),
  );
}
