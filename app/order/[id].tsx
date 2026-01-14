import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getOrder } from '@/services/orders';
import { Order } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (greska) {
      console.error('Greška pri učitavanju porudžbine:', greska);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <ThemedText>Porudžbina nije pronađena</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="title" style={styles.title}>
            Porudžbina #{order.id.slice(0, 8)}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <ThemedText style={styles.statusText}>{getStatusText(order.status)}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Proizvodi</ThemedText>
          {order.items.map((item, index) => (
            <View key={index} style={[styles.item, { borderColor: colors.icon }]}>
              <ThemedText type="defaultSemiBold">{item.product.name}</ThemedText>
              <ThemedText style={[styles.itemDetails, { color: colors.icon }]}>
                Količina: {item.quantity} × {item.product.price.toFixed(2)} RSD
              </ThemedText>
              <ThemedText style={[styles.itemTotal, { color: colors.tint }]}>
                {(item.product.price * item.quantity).toFixed(2)} RSD
              </ThemedText>
            </View>
          ))}
        </View>

        {order.shippingAddress && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Adresa dostave</ThemedText>
            <ThemedText>{order.shippingAddress}</ThemedText>
          </View>
        )}

        {order.phone && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Telefon</ThemedText>
            <ThemedText>{order.phone}</ThemedText>
          </View>
        )}

        <View style={styles.section}>
          <View style={[styles.totalRow, { borderTopColor: colors.icon }]}>
            <ThemedText type="defaultSemiBold" style={styles.totalLabel}>Ukupno:</ThemedText>
            <ThemedText type="defaultSemiBold" style={[styles.totalAmount, { color: colors.tint }]}>
              {order.total.toFixed(2)} RSD
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Datum</ThemedText>
          <ThemedText style={[styles.date, { color: colors.icon }]}>
            {order.createdAt?.toDate?.().toLocaleString() || 'N/A'}
          </ThemedText>
        </View>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  item: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 20,
  },
  totalAmount: {
    fontSize: 24,
  },
  date: {
    fontSize: 16,
  },
});
