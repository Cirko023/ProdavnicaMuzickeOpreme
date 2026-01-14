import { Colors } from '@/constants/theme';
import { useCart } from '@/contexts/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Product } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { dodajUKorpu } = useCart();

  const handleAddToCart = () => {
    dodajUKorpu(product, 1);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.icon }]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.icon + '20' }]}>
          <ThemedText style={styles.placeholderText}>Nema slike</ThemedText>
        </View>
      )}
      
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={2}>
          {product.name}
        </ThemedText>
        {product.brand && (
          <ThemedText style={[styles.brand, { color: colors.icon }]}>
            {product.brand}
          </ThemedText>
        )}
        <ThemedText type="defaultSemiBold" style={[styles.price, { color: colors.tint }]}>
          {product.price.toFixed(2)} RSD
        </ThemedText>
        <ThemedText style={[styles.stock, { color: product.stock > 0 ? '#4CAF50' : '#F44336' }]}>
          {product.stock > 0 ? `Na stanju: ${product.stock}` : 'Nema na stanju'}
        </ThemedText>
      </View>
      
      {product.stock > 0 && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddToCart}
        >
          <ThemedText style={styles.addButtonText}>Dodaj u korpu</ThemedText>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    marginBottom: 4,
  },
  stock: {
    fontSize: 12,
    marginBottom: 8,
  },
  addButton: {
    margin: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff  `',
    fontWeight: '600',
  },
});
