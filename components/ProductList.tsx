import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setProducts } from '@/store/productsSlice';
import { getProducts, searchProducts } from '@/services/products';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProductListProps {
  category: 'gitare' | 'pedale' | 'oprema';
}

export default function ProductList({ category }: ProductListProps) {
  const dispatch = useDispatch();
  const proizvodi = useSelector((state: RootState) => state.products.proizvodi);

  const [filteredProducts, setFilteredProducts] = useState(proizvodi);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadProducts();
  }, [category]);

  useEffect(() => {
    filterAndSortProducts();
  }, [proizvodi, searchTerm, sortBy, priceFilter, category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(category);
      dispatch(setProducts(data));
    } catch (greska) {
      console.error('Greška pri učitavanju proizvoda:', greska);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = async () => {
    try {
      let filtered = [...proizvodi];

      // Filter pretrage
      if (searchTerm) {
        filtered = await searchProducts(searchTerm, category);
      }

      // Filter za cenu
      if (priceFilter) {
        filtered = filtered.filter(
          (p) => p.price >= priceFilter.min && p.price <= priceFilter.max
        );
      }

      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });

      setFilteredProducts(filtered);
    } catch (greska) {
      console.error('Greška pri filtriranju proizvoda:', greska);
      setFilteredProducts(proizvodi);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text, borderColor: colors.icon }]}
          placeholder="Pretraži proizvode..."
          placeholderTextColor={colors.icon}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'name' && { backgroundColor: colors.tint }]}
          onPress={() => setSortBy('name')}
        >
          <ThemedText style={[styles.filterText, sortBy === 'name' && { color: '#fff' }]}>
            Naziv
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'price-asc' && { backgroundColor: colors.tint }]}
          onPress={() => setSortBy('price-asc')}
        >
          <ThemedText style={[styles.filterText, sortBy === 'price-asc' && { color: '#fff' }]}>
            Cena ↑
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'price-desc' && { backgroundColor: colors.tint }]}
          onPress={() => setSortBy('price-desc')}
        >
          <ThemedText style={[styles.filterText, sortBy === 'price-desc' && { color: '#fff' }]}>
            Cena ↓
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <ThemedText>Nema proizvoda</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterText: {
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});