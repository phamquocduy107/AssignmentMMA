import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { FavoritesProvider } from '@/context/FavoritesContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="detail/[id]"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </FavoritesProvider>
  );
}
