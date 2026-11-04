/* eslint-env jest */
// Mọi thứ chạm tới native/mạng đều bị mock: test không được mở kết nối Firebase.
jest.mock('./src/services/firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));

jest.mock('./src/services/authService', () => ({
  register: jest.fn(() => Promise.resolve()),
  login: jest.fn(() => Promise.resolve()),
  logout: jest.fn(() => Promise.resolve()),
  subscribeAuth: jest.fn(cb => {
    cb(null);
    return () => {};
  }),
  mapAuthError: jest.fn(() => 'Đã có lỗi xảy ra, vui lòng thử lại'),
}));

jest.mock('./src/services/userService', () => ({
  subscribeUsers: jest.fn(() => () => {}),
  subscribeMyProfile: jest.fn(() => () => {}),
}));

jest.mock('./src/services/presenceService', () => ({
  startPresence: jest.fn(() => () => {}),
  setOffline: jest.fn(() => Promise.resolve()),
  pauseConnection: jest.fn(),
  resumeConnection: jest.fn(),
  subscribeStatuses: jest.fn(() => () => {}),
}));

jest.mock('./src/services/chatService', () => ({
  getChatId: jest.fn((a, b) => [a, b].sort().join('_')),
  sendText: jest.fn(() => Promise.resolve()),
  sendLocation: jest.fn(() => Promise.resolve()),
  subscribeMessages: jest.fn(() => () => {}),
  subscribeUserChats: jest.fn(() => () => {}),
  markRead: jest.fn(() => Promise.resolve()),
}));

jest.mock('./src/services/locationService', () => ({
  LocationError: class LocationError extends Error {
    constructor(code) {
      super(code);
      this.code = code;
    }
  },
  getCurrentLocation: jest.fn(() => Promise.resolve({ lat: 0, lng: 0 })),
  openInGoogleMaps: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const createAsyncStorage = () => {
    const store = new Map();
    return {
      getItem: jest.fn(async key => (store.has(key) ? store.get(key) : null)),
      setItem: jest.fn(async (key, value) => {
        store.set(key, value);
      }),
      removeItem: jest.fn(async key => {
        store.delete(key);
      }),
    };
  };
  return { createAsyncStorage, getLegacyStorage: createAsyncStorage };
});

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    setRNConfiguration: jest.fn(),
    requestAuthorization: jest.fn(),
    getCurrentPosition: jest.fn(),
  },
}));
