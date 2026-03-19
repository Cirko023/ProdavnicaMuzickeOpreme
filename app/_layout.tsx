import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerForPushNotifications } from '@/services/notifications';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Registruj notifikacije sa error handling-om
    registerForPushNotifications().catch((error) => {
      console.log('Greška pri inicijalizaciji notifikacija:', error);
    });
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ title: 'Proizvod' }} />
          <Stack.Screen name="orders" options={{ title: 'Porudžbine' }} />
          <Stack.Screen name="order/[id]" options={{ title: 'Detalji porudžbine' }} />
          <Stack.Screen name="qr-scanner" options={{ title: 'Skeniraj QR kod' }} />
          <Stack.Screen name="admin/product/[id]" options={{ title: 'Proizvod' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
