import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder } from '@/services/orders'
import { scheduleOrderNotification } from '@/services/notifications'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { ukloniIzKorpe, ocistiKorpu, azurirajKolicinu } from '@/store/cartSlice'


export default function CartScreen() {
  const dispatch = useDispatch();

  const stavke = useSelector((state: RootState) => state.cart.stavke)

  const { korisnickiPodaci } = useAuth();
  const [adresaDostave, setAdresaDostave] = useState(korisnickiPodaci?.adresa || '');
  const [telefon, setTelefon] = useState(korisnickiPodaci?.telefon || '');
  const [ucitava, setUcitava] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

const ukupno = stavke.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!adresaDostave || !telefon) {
      Alert.alert('Greška', 'Molimo unesite adresu i telefon');
      return;
    }

    if (stavke.length === 0) {
      Alert.alert('Greška', 'Korpa je prazna');
      return;
    }

    if (!korisnickiPodaci) {
      Alert.alert('Greška', 'Morate biti prijavljeni da biste naručili');
      return;
    }

    setUcitava(true);
    try {
      const idPorudzbine = await createOrder(korisnickiPodaci.uid, stavke, adresaDostave, telefon);
      await scheduleOrderNotification(idPorudzbine);

      dispatch(ocistiKorpu());

      Alert.alert('Uspešno', 'Porudžbina je kreirana', [
        { text: 'OK', onPress: () => router.push(`/order/${idPorudzbine}`) },
      ]);
    } catch (greska) {
      console.error('Greška pri kreiranju porudžbine:', greska);
      Alert.alert('Greška', 'Neuspešno kreiranje porudžbine');
    } finally {
      setUcitava(false);
    }
  };

  if (stavke.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Korpa</ThemedText>
        </ThemedView>
        <View style={styles.empty}>
          <ThemedText style={styles.emptyText}>Korpa je prazna</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Korpa</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        {stavke.map((stavka) => (
          <View key={stavka.product.id} style={[styles.item, { borderColor: colors.icon }]}>
            <View style={styles.itemInfo}>
              <ThemedText type="defaultSemiBold">{stavka.product.name}</ThemedText>
              <ThemedText style={[styles.price, { color: colors.tint }]}>
                {stavka.product.price.toFixed(2)} RSD
              </ThemedText>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.icon + '20' }]}
                onPress={() =>
                  dispatch(azurirajKolicinu({
                    id: stavka.product.id,
                    quantity: stavka.quantity - 1
                  }))
                }
              >
                <ThemedText>-</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.quantity}>{stavka.quantity}</ThemedText>

              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.icon + '20' }]}
                onPress={() =>
                  dispatch(azurirajKolicinu({
                    id: stavka.product.id,
                    quantity: stavka.quantity + 1
                  }))
                }
              >
                <ThemedText>+</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => dispatch(ukloniIzKorpe(stavka.product.id))}
            >
              <ThemedText style={[styles.removeText, { color: '#F44336' }]}>
                Ukloni
              </ThemedText>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.shippingForm}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            Podaci za dostavu
          </ThemedText>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            placeholder="Adresa"
            placeholderTextColor={colors.icon}
            value={adresaDostave}
            onChangeText={setAdresaDostave}
          />

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            placeholder="Telefon"
            placeholderTextColor={colors.icon}
            value={telefon}
            onChangeText={setTelefon}
            keyboardType="phone-pad"
          />
        </View>

        <View style={[styles.total, { borderTopColor: colors.icon }]}>
          <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
            Ukupno:
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={[styles.totalAmount, { color: colors.tint }]}>
            {ukupno.toFixed(2)} RSD
          </ThemedText>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.checkoutButton, { backgroundColor: colors.tint }]}
        onPress={handleCheckout}
        disabled={ucitava}
      >
        <ThemedText style={styles.checkoutText}>
          {ucitava ? 'Kreiranje porudžbine...' : 'Naruči'}
        </ThemedText>
      </TouchableOpacity>
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 14,
  },
  shippingForm: {
    marginTop: 24,
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 18,
  },
  totalAmount: {
    fontSize: 20,
  },
  checkoutButton: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
