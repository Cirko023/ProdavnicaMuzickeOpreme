import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { deleteProduct, getProducts } from '@/services/products';
import { Product } from '@/store/productsSlice';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminProductsScreen() {
  const [proizvodi, setProizvodi] = useState<Product[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [pretraga, setPretraga] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    ucitajProizvode();
  }, []);

  const ucitajProizvode = async () => {
    setUcitava(true);
    try {
      const podaci = await getProducts();
      setProizvodi(podaci);
    } catch (greska) {
      console.error('Greška pri učitavanju proizvoda:', greska);
    } finally {
      setUcitava(false);
    }
  };

  const handleDelete = (proizvod: Product) => {
    Alert.alert('Brisanje proizvoda', `Da li ste sigurni da želite da obrišete ${proizvod.name}?`, [
      { text: 'Otkaži', style: 'cancel' },
      {
        text: 'Obriši',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(proizvod.id);
            ucitajProizvode();
          } catch (greska) {
            Alert.alert('Greška', 'Neuspešno brisanje proizvoda');
          }
        },
      },
    ]);
  };

  const filtriraniProizvodi = proizvodi.filter((p) =>
    p.name.toLowerCase().includes(pretraga.toLowerCase()) ||
    p.brand?.toLowerCase().includes(pretraga.toLowerCase())
  );

  if (ucitava) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Proizvodi</ThemedText>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={() => router.push('/admin/product/new')}
        >
          <ThemedText style={styles.addButtonText}>+ Dodaj proizvod</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: colors.text, borderColor: colors.icon }]}
          placeholder="Pretraži proizvode..."
          placeholderTextColor={colors.icon}
          value={pretraga}
          onChangeText={setPretraga}
        />
      </View>

      <FlatList
        data={filtriraniProizvodi}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.productCard, { borderColor: colors.icon }]}>
            <View style={styles.productInfo}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <ThemedText style={[styles.category, { color: colors.icon }]}>
                {item.category} • {item.price.toFixed(2)} RSD
              </ThemedText>
              <ThemedText style={[styles.stock, { color: item.stock > 0 ? '#4CAF50' : '#F44336' }]}>
                Stanje: {item.stock}
              </ThemedText>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push(`/admin/product/${item.id}`)}
              >
                <ThemedText style={styles.actionButtonText}>Izmeni</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item)}
              >
                <ThemedText style={[styles.actionButtonText, { color: '#fff' }]}>Obriši</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    paddingTop: 0,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  productCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  productInfo: {
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    marginTop: 4,
  },
  stock: {
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
