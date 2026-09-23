import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { startProductsListener } from '@/store/productsSlice';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProductListProps {
  category: 'gitare' | 'pedale' | 'oprema';
}

export default function ProductList({ category }: ProductListProps) {
  const dispatch = useDispatch();
  
  const { proizvodi, ucitava } = useSelector((state: RootState) => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const unsubscribe = dispatch(startProductsListener() as any);
    
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    let result = proizvodi.filter(p => p.category === category);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.brand?.toLowerCase().includes(term)
      );
    }

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [proizvodi, category, searchTerm, sortBy]);

  if (ucitava && proizvodi.length === 0) {
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
          placeholder={`Pretraži ${category}...`}
          placeholderTextColor={colors.icon}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.filterContainer}>
        {['name', 'price-asc', 'price-desc'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton, 
              sortBy === type && { backgroundColor: colors.tint }
            ]}
            onPress={() => setSortBy(type as any)}
          >
            <ThemedText style={[styles.filterText, sortBy === type && { color: '#fff' }]}>
              {type === 'name' ? 'Naziv' : type === 'price-asc' ? 'Cena ↑' : 'Cena ↓'}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <ThemedText>Nema proizvoda u kategoriji {category}</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  
  searchContainer: { 
    padding: 16 
  },

  searchInput: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16 
  },

  filterContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingBottom: 8, 
    gap: 8 
  },

  filterButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },

  filterText: { 
    fontSize: 14 
  },

  list: { 
    padding: 16 
  },

  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
});