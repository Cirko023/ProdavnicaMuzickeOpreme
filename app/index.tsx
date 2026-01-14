import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const { korisnik, korisnickiPodaci, ucitava } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (!ucitava) {
      if (!korisnik) {
        router.replace('/login');
      } else if (korisnickiPodaci?.uloga === 'admin') {
        router.replace('/(admin)/products');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [korisnik, korisnickiPodaci, ucitava]);

  if (ucitava) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
