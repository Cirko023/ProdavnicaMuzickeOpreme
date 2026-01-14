import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders } from '@/services/orders';
import { Order } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OrdersScreen() {
  const { korisnickiPodaci } = useAuth();
  const [porudzbine, setPorudzbine] = useState<Order[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    ucitajPorudzbine();
  }, []);

  const ucitajPorudzbine = async () => {
    if (!korisnickiPodaci) return;
    
    setUcitava(true);
    try {
      const podaci = await getUserOrders(korisnickiPodaci.uid);
      setPorudzbine(podaci);
    } catch (greska) {
      console.error('Greška pri učitavanju porudžbina:', greska);
    } finally {
      setUcitava(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#9C27B0';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return colors.icon;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Na čekanju';
      case 'processing':
        return 'U obradi';
      case 'shipped':
        return 'Poslato';
      case 'delivered':
        return 'Isporučeno';
      case 'cancelled':
        return 'Otkazano';
      default:
        return status;
    }
  };

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
        <ThemedText type="title" style={styles.title}>Moje porudžbine</ThemedText>
      </ThemedView>
      <FlatList
        data={porudzbine}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={styles.emptyText}>Nemate porudžbina</ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.orderCard, { borderColor: colors.icon }]}
            onPress={() => router.push(`/order/${item.id}`)}
          >
            <View style={styles.orderHeader}>
              <ThemedText type="defaultSemiBold">Porudžbina #{item.id.slice(0, 8)}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <ThemedText style={styles.statusText}>{getStatusText(item.status)}</ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.date, { color: colors.icon }]}>
              {item.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={[styles.total, { color: colors.tint }]}>
              Ukupno: {item.total.toFixed(2)} RSD
            </ThemedText>
            <ThemedText style={[styles.itemsCount, { color: colors.icon }]}>
              {item.items.length} proizvoda
            </ThemedText>
          </TouchableOpacity>
        )}
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  orderCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    marginBottom: 4,
  },
  itemsCount: {
    fontSize: 14,
  },
});
