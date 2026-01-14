import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getAllOrders, updateOrderStatus } from '@/services/orders';
import { scheduleStatusUpdateNotification } from '@/services/notifications';
import { Order } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await scheduleStatusUpdateNotification(orderId, getStatusText(newStatus));
      loadOrders();
    } catch (error) {
      Alert.alert('Greška', 'Neuspešna izmena statusa');
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

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return null;
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
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Porudžbine</ThemedText>
      </ThemedView>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const nextStatus = getNextStatus(item.status);
          return (
            <View style={[styles.orderCard, { borderColor: colors.icon }]}>
              <TouchableOpacity onPress={() => router.push(`/order/${item.id}`)}>
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
              {nextStatus && (
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: colors.tint }]}
                  onPress={() => handleStatusChange(item.id, nextStatus)}
                >
                  <ThemedText style={styles.statusButtonText}>
                    {getStatusText(nextStatus)}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText>Nema porudžbina</ThemedText>
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
  statusButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
