import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Config của Web app Firebase không phải bí mật; bảo mật dựa vào Auth + Rules.
const firebaseConfig = {
  apiKey: 'AIzaSyDGHSJag6_Ov2u2_TBjhc8ZpGBXj76Q4BQ',
  authDomain: 'chat-realtime-1-1.firebaseapp.com',
  databaseURL:
    'https://chat-realtime-1-1-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'chat-realtime-1-1',
  storageBucket: 'chat-realtime-1-1.firebasestorage.app',
  messagingSenderId: '141974859947',
  appId: '1:141974859947:web:df955bb6635eacd456c7ee',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(createAsyncStorage('firebase-auth')),
    });
  } catch {
    // Fast Refresh: initializeAuth ném auth/already-initialized ở lần gọi thứ hai.
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getDatabase(app);
