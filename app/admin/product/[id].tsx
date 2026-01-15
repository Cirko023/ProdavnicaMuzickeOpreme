import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createProduct, getProduct, updateProduct } from '@/services/products';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminProductFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'gitare' as 'gitare' | 'pedale' | 'oprema',
    stock: '',
    brand: '',
    image: '',
  });
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (!isNew) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }
    try {
      const product = await getProduct(id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          stock: product.stock.toString(),
          brand: product.brand || '',
          image: product.image || '',
        });
      }
    } catch (greska) {
      console.error('Greška pri učitavanju proizvoda:', greska);
      Alert.alert('Greška', 'Neuspešno učitavanje proizvoda');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      Alert.alert('Greška', 'Molimo popunite sva obavezna polja');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        brand: formData.brand || undefined,
        image: formData.image || undefined,
      };

      if (isNew) {
        await createProduct(productData);
        Alert.alert('Uspešno', 'Proizvod je kreiran', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        if (!id) {
          Alert.alert('Greška', 'ID proizvoda nije pronađen');
          return;
        }
        await updateProduct(id, productData);
        Alert.alert('Uspešno', 'Proizvod je ažuriran', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (greska) {
      console.error('Greška pri čuvanju proizvoda:', greska);
      Alert.alert('Greška', 'Neuspešno čuvanje proizvoda');
    } finally {
      setSaving(false);
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
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent} // Dodajemo ovo
          showsVerticalScrollIndicator={false}
        >
        <ThemedText type="title" style={styles.title}>
          {isNew ? 'Novi proizvod' : 'Izmeni proizvod'}
        </ThemedText>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Naziv *</ThemedText>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Naziv proizvoda"
            placeholderTextColor={colors.icon}
          />
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Opis *</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.icon }]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Opis proizvoda"
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Cena (RSD) *</ThemedText>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="0.00"
            placeholderTextColor={colors.icon}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Kategorija *</ThemedText>
          <View style={styles.categoryContainer}>
            {(['gitare', 'pedale', 'oprema'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  formData.category === cat && { backgroundColor: colors.tint },
                  { borderColor: colors.icon },
                ]}
                onPress={() => setFormData({ ...formData, category: cat })}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    formData.category === cat && { color: '#fff' },
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Količina na stanju *</ThemedText>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
            placeholder="0"
            placeholderTextColor={colors.icon}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Brend</ThemedText>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
            placeholder="Brend proizvoda"
            placeholderTextColor={colors.icon}
          />
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>URL slike</ThemedText>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            value={formData.image}
            onChangeText={(text) => setFormData({ ...formData, image: text })}
            placeholder="https://..."
            placeholderTextColor={colors.icon}
            keyboardType="url"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={handleSave}
          disabled={saving}
        >
          <ThemedText style={styles.saveButtonText}>
            {saving ? 'Čuvanje...' : isNew ? 'Kreiraj' : 'Sačuvaj izmene'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,   
    paddingBottom: 80, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 0,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 26,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
