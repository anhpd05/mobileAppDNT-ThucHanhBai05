import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

// Một nguồn duy nhất cho cả app: danh sách 20+ dòng không mở 20+ listener.
let reduceMotion = false;
const listeners = new Set<() => void>();
let stopNative: (() => void) | null = null;

function update(next: boolean) {
  if (next !== reduceMotion) {
    reduceMotion = next;
    listeners.forEach(listener => listener());
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!stopNative) {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(update)
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      update,
    );
    stopNative = () => subscription.remove();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && stopNative) {
      stopNative();
      stopNative = null;
    }
  };
}

function getSnapshot() {
  return reduceMotion;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
