import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useCart } from '@/contexts/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getProduct } from '@/services/products';
import { Product } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [proizvod, setProizvod] = useState<Product | null>(null);
  const [ucitava, setUcitava] = useState(true);
  const { dodajUKorpu } = useCart();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    ucitajProizvod();
  }, [id]);

  const ucitajProizvod = async () => {
    if (!id) {
      setUcitava(false);
      return;
    }
    try {
      const podaci = await getProduct(id);
      setProizvod(podaci);
    } catch (greska) {
      console.error('Greška pri učitavanju proizvoda:', greska);
    } finally {
      setUcitava(false);
    }
  };

  const handleAddToCart = () => {
    if (proizvod && proizvod.stock > 0) {
      dodajUKorpu(proizvod, 1);
      Alert.alert('Uspešno', 'Proizvod je dodat u korpu');
    }
  };

  if (ucitava) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!proizvod) {
    return (
      <View style={styles.center}>
        <ThemedText>Proizvod nije pronađen</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {proizvod.image ? (
          <Image source={{ uri: proizvod.image }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.icon + '20' }]}>
            <ThemedText style={styles.placeholderText}>Nema slike</ThemedText>
          </View>
        )}

        <View style={styles.content}>
          <ThemedText type="title" style={styles.name}>{proizvod.name}</ThemedText>
          {proizvod.brand && (
            <ThemedText style={[styles.brand, { color: colors.icon }]}>
              {proizvod.brand}
            </ThemedText>
          )}
          <ThemedText type="defaultSemiBold" style={[styles.price, { color: colors.tint }]}>
            {proizvod.price.toFixed(2)} RSD
          </ThemedText>
          <ThemedText style={[styles.stock, { color: proizvod.stock > 0 ? '#4CAF50' : '#F44336' }]}>
            {proizvod.stock > 0 ? `Na stanju: ${proizvod.stock}` : 'Nema na stanju'}
          </ThemedText>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Opis</ThemedText>
            <ThemedText style={styles.description}>{proizvod.description}</ThemedText>
          </View>
        </View>
      </ScrollView>

      {proizvod.stock > 0 && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddToCart}
        >
          <ThemedText style={styles.addButtonText}>Dodaj u korpu</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    marginBottom: 8,
  },
  stock: {
    fontSize: 16,
    marginBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  addButton: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
