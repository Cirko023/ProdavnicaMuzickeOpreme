import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { korisnik, korisnickiPodaci, odjava, azurirajKorisnickePodatke } = useAuth();
  const [ime, setIme] = useState(korisnickiPodaci?.ime || '');
  const [telefon, setTelefon] = useState(korisnickiPodaci?.telefon || '');
  const [adresa, setAdresa] = useState(korisnickiPodaci?.adresa || '');
  const [editing, setEditing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSave = async () => {
    try {
      await azurirajKorisnickePodatke({ ime, telefon, adresa });
      setEditing(false);
      Alert.alert('Uspešno', 'Podaci su sačuvani');
    } catch (greska) {
      Alert.alert('Greška', 'Neuspešno čuvanje podataka');
    }
  };

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
        <ThemedText type="title" style={styles.title}>Profil</ThemedText>
      </ThemedView>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Lični podaci</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedText style={[styles.value, { color: colors.icon }]}>
              {korisnickiPodaci?.email || korisnik?.email}
            </ThemedText>
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Ime</ThemedText>
            {editing ? (
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
                value={ime}
                onChangeText={setIme}
              />
            ) : (
              <ThemedText style={[styles.value, { color: colors.icon }]}>
                {korisnickiPodaci?.ime || 'Nije uneto'}
              </ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Telefon</ThemedText>
            {editing ? (
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
                value={telefon}
                onChangeText={setTelefon}
                keyboardType="phone-pad"
              />
            ) : (
              <ThemedText style={[styles.value, { color: colors.icon }]}>
                {korisnickiPodaci?.telefon || 'Nije uneto'}
              </ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Adresa</ThemedText>
            {editing ? (
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
                value={adresa}
                onChangeText={setAdresa}
                multiline
              />
            ) : (
              <ThemedText style={[styles.value, { color: colors.icon }]}>
                {korisnickiPodaci?.adresa || 'Nije uneto'}
              </ThemedText>
            )}
          </View>

          {editing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.tint }]}
                onPress={handleSave}
              >
                <ThemedText style={styles.buttonText}>Sačuvaj</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { borderColor: colors.icon }]}
                onPress={() => {
                  setIme(korisnickiPodaci?.ime || '');
                  setTelefon(korisnickiPodaci?.telefon || '');
                  setAdresa(korisnickiPodaci?.adresa || '');
                  setEditing(false);
                }}
              >
                <ThemedText style={[styles.buttonText, { color: colors.text }]}>Otkaži</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.tint }]}
              onPress={() => setEditing(true)}
            >
              <ThemedText style={styles.buttonText}>Izmeni podatke</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.icon }]}
            onPress={() => router.push('/orders')}
          >
            <ThemedText>Moje porudžbine</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.icon }]}
            onPress={() => router.push('/qr-scanner')}
          >
            <ThemedText>Skeniraj QR kod</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#F44336' }]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutText}>Odjavi se</ThemedText>
        </TouchableOpacity>
      </ScrollView>
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  menuItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
