import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RegisterScreen() {
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [potvrdaLozinke, setPotvrdaLozinke] = useState('');
  const [ucitava, setUcitava] = useState(false);
  const { registracija } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRegister = async () => {
    if (!ime || !email || !lozinka) {
      Alert.alert('Greška', 'Molimo popunite sva polja');
      return;
    }

    if (lozinka !== potvrdaLozinke) {
      Alert.alert('Greška', 'Lozinke se ne poklapaju');
      return;
    }

    if (lozinka.length < 6) {
      Alert.alert('Greška', 'Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    setUcitava(true);
    try {
      await registracija(email, lozinka, ime);
      router.replace('/(tabs)');
    } catch (greska: any) {
      Alert.alert('Greška pri registraciji', greska.message || 'Neuspešna registracija');
    } finally {
      setUcitava(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Registracija</ThemedText>
        
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          placeholder="Ime"
          placeholderTextColor={colors.icon}
          value={ime}
          onChangeText={setIme}
        />
        
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          placeholder="Email"
          placeholderTextColor={colors.icon}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          placeholder="Lozinka"
          placeholderTextColor={colors.icon}
          value={lozinka}
          onChangeText={setLozinka}
          secureTextEntry
        />
        
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          placeholder="Potvrdite lozinku"
          placeholderTextColor={colors.icon}
          value={potvrdaLozinke}
          onChangeText={setPotvrdaLozinke}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleRegister}
          disabled={ucitava}
        >
          <ThemedText style={styles.buttonText}>
            {ucitava ? 'Registracija...' : 'Registruj se'}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.linkButton}
        >
          <ThemedText style={[styles.linkText, { color: colors.tint }]}>
            Već imate nalog? Prijavite se
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});
