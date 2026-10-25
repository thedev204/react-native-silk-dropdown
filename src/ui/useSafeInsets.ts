import { createContext, useContext, useMemo } from 'react';
import { Platform, StatusBar } from 'react-native';

import type { Insets } from '../types';

const FALLBACK: Insets = {
  top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  right: 0,
  bottom: 0,
  left: 0,
};

/**
 * Prefer the peer's context over `useSafeAreaInsets()`.
 * The hook throws when no provider is mounted ("No safe area value available");
 * the context returns `null` instead, so we can fall back cleanly.
 */
const LocalSafeAreaContext = createContext<Insets | null>(null);

type SafeAreaInsetsContextType = typeof LocalSafeAreaContext;

let PeerSafeAreaInsetsContext: SafeAreaInsetsContextType | null = null;
try {
  PeerSafeAreaInsetsContext = (
    require('react-native-safe-area-context') as {
      SafeAreaInsetsContext: SafeAreaInsetsContextType;
    }
  ).SafeAreaInsetsContext;
} catch {
  PeerSafeAreaInsetsContext = null;
}

/**
 * Optional safe-area insets with RN defaults as fallback.
 */
export function useSafeInsets(): Insets {
  const peerInsets = useContext(
    PeerSafeAreaInsetsContext ?? LocalSafeAreaContext
  );

  return useMemo(() => peerInsets ?? FALLBACK, [peerInsets]);
}
