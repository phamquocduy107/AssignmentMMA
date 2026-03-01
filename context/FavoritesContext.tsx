import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { Handbag } from '@/types/handbag';

const STORAGE_KEY = '@handbag_favorites';

// ── Cross-platform storage wrapper ────────────────────────────────────────────
// On web: AsyncStorage's native module doesn't exist → fall back to localStorage
// On native (iOS/Android via Expo Go or dev build): use AsyncStorage as normal
async function storageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  return AsyncStorage.getItem(key);
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  await AsyncStorage.setItem(key, value);
}
// ─────────────────────────────────────────────────────────────────────────────

interface FavoritesContextType {
  favorites: Handbag[];
  addFavorite: (item: Handbag) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  isFavorite: (id: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Handbag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await storageGet(STORAGE_KEY);
        if (stored) setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = async (items: Handbag[]) => {
    try {
      await storageSet(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  };

  const addFavorite = async (item: Handbag) => {
    setFavorites(prev => {
      if (prev.find(f => f.id === item.id)) return prev;
      const next = [...prev, item];
      persist(next);
      return next;
    });
  };

  const removeFavorite = async (id: string) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id);
      persist(next);
      return next;
    });
  };

  const clearFavorites = async () => {
    setFavorites([]);
    await persist([]);
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, clearFavorites, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
