import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminProfileScreen() {
  const { korisnik, korisnickiPodaci, odjava } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = async () => {
    Alert.alert('Odjava', 'Da li ste sigurni da želite da se odjavite?', [
      { text: 'Otkaži', style: 'cancel' },
      {
        text: 'Odjavi se',
        style: 'destructive',
        onPress: async () => {
          await odjava();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Admin Profil</ThemedText>
      </ThemedView>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Informacije</ThemedText>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedText style={[styles.value, { color: colors.icon }]}>
              {korisnickiPodaci?.email || korisnik?.email}
            </ThemedText>
          </View>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Uloga</ThemedText>
            <ThemedText style={[styles.value, { color: colors.tint }]}>
              Administrator
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#F44336' }]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutText}>Odjavi se</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
