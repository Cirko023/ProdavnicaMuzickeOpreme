import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { registerForPushNotifications } from '@/services/notifications';

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
    <AuthProvider>
      <CartProvider>
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
      </CartProvider>
    </AuthProvider>
  );
}
