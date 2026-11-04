import { onValue, ref } from 'firebase/database';
import type { Unsubscribe } from '../types/models';
import { db } from './firebase';

export type UserProfile = { name: string };

export function subscribeUsers(
  cb: (users: Record<string, UserProfile>) => void,
): Unsubscribe {
  return onValue(
    ref(db, 'users'),
    snap => cb(snap.val() ?? {}),
    () => cb({}),
  );
}

export function subscribeMyProfile(
  uid: string,
  cb: (profile: UserProfile | null) => void,
): Unsubscribe {
  return onValue(
    ref(db, 'users/' + uid),
    snap => cb(snap.val() ?? null),
    () => cb(null),
  );
}
