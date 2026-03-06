import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const PREFIX = "@custom_img_";

interface CustomImagesContextType {
  getCustomUri: (id: string) => string | null;
  setCustomUri: (id: string, uri: string) => Promise<void>;
  removeCustomUri: (id: string) => Promise<void>;
}

const CustomImagesContext = createContext<CustomImagesContextType | undefined>(
  undefined,
);

export function CustomImagesProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Record<string, string>>({});

  // Load all persisted custom images on mount
  useEffect(() => {
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const customKeys = keys.filter((k) => k.startsWith(PREFIX));
        if (customKeys.length === 0) return;
        const pairs = await AsyncStorage.multiGet(customKeys);
        const map: Record<string, string> = {};
        pairs.forEach(([key, val]) => {
          if (val) map[key.replace(PREFIX, "")] = val;
        });
        setImages(map);
      } catch (e) {
        console.warn("CustomImagesContext load error:", e);
      }
    })();
  }, []);

  const getCustomUri = useCallback(
    (id: string) => images[id] ?? null,
    [images],
  );

  const setCustomUri = useCallback(async (id: string, uri: string) => {
    setImages((prev) => ({ ...prev, [id]: uri }));
    await AsyncStorage.setItem(`${PREFIX}${id}`, uri);
  }, []);

  const removeCustomUri = useCallback(async (id: string) => {
    setImages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await AsyncStorage.removeItem(`${PREFIX}${id}`);
  }, []);

  return (
    <CustomImagesContext.Provider
      value={{ getCustomUri, setCustomUri, removeCustomUri }}
    >
      {children}
    </CustomImagesContext.Provider>
  );
}

export function useCustomImages() {
  const ctx = useContext(CustomImagesContext);
  if (!ctx)
    throw new Error("useCustomImages must be used within CustomImagesProvider");
  return ctx;
}
