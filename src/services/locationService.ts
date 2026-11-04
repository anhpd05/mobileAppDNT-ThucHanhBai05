import Geolocation from '@react-native-community/geolocation';
import type { GeolocationError } from '@react-native-community/geolocation';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import type { GeoPoint } from '../types/models';

export type LocationErrorCode = 'denied' | 'blocked' | 'unavailable';

export class LocationError extends Error {
  code: LocationErrorCode;

  constructor(code: LocationErrorCode) {
    super(code);
    this.name = 'LocationError';
    this.code = code;
  }
}

const PERMISSION_DENIED = 1;
const TIMEOUT = 3;

async function ensurePermission(): Promise<void> {
  if (Platform.OS === 'android') {
    const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } =
      PermissionsAndroid.PERMISSIONS;
    // Android 12+: FINE phải xin cùng COARSE trong một lần; chỉ cần một trong hai được cấp.
    const results = await PermissionsAndroid.requestMultiple([
      ACCESS_FINE_LOCATION,
      ACCESS_COARSE_LOCATION,
    ]);
    const values = Object.values(results);
    if (values.includes(PermissionsAndroid.RESULTS.GRANTED)) {
      return;
    }
    throw new LocationError(
      values.includes(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
        ? 'blocked'
        : 'denied',
    );
  }
  await new Promise<void>((resolve, reject) => {
    Geolocation.requestAuthorization(resolve, () =>
      reject(new LocationError('denied')),
    );
  });
}

type Reading = { point: GeoPoint } | { error: GeolocationError };

// Không bao giờ reject: lỗi trả về dưới dạng giá trị để phân loại mà không cần ép kiểu.
function readPosition(enableHighAccuracy: boolean): Promise<Reading> {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ point: { lat: coords.latitude, lng: coords.longitude } }),
      error => resolve({ error }),
      { enableHighAccuracy, timeout: 15000, maximumAge: 10000 },
    );
  });
}

export async function getCurrentLocation(): Promise<GeoPoint> {
  await ensurePermission();
  let reading = await readPosition(true);
  if ('error' in reading && reading.error.code === TIMEOUT) {
    // Máy ảo hay timeout khi bật độ chính xác cao → thử lại một lần với độ chính xác thường.
    reading = await readPosition(false);
  }
  if ('error' in reading) {
    throw new LocationError(
      reading.error.code === PERMISSION_DENIED ? 'denied' : 'unavailable',
    );
  }
  return reading.point;
}

// Không dùng canOpenURL → không cần khai báo <queries> trong AndroidManifest.
export function openInGoogleMaps({ lat, lng }: GeoPoint): Promise<void> {
  return Linking.openURL(
    'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng,
  );
}
