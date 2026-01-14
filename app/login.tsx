import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [ucitava, setUcitava] = useState(false);
  const { prijava } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    if (!email || !lozinka) {
      Alert.alert('Greška', 'Molimo unesite email i lozinku');
      return;
    }

    setUcitava(true);
    try {
      await prijava(email, lozinka);
      router.replace('/(tabs)');
    } catch (greska: any) {
      Alert.alert('Greška pri prijavi', greska.message || 'Neuspešna prijava');
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
        <ThemedText type="title" style={styles.title}>Prijava</ThemedText>
        
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
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleLogin}
          disabled={ucitava}
        >
          <ThemedText style={styles.buttonText}>
            {ucitava ? 'Prijavljivanje...' : 'Prijavi se'}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={styles.linkButton}
        >
          <ThemedText style={[styles.linkText, { color: colors.tint }]}>
            Nemate nalog? Registrujte se
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
