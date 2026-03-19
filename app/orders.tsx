import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store/store';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function OrdersScreen() {
  const korisnik = useSelector((state: RootState) => state.auth.korisnik);

  const svePorudzbine = useSelector(
    (state: RootState) => state.orders.porudzbine
  );

  const mojePorudzbine = svePorudzbine.filter(
    (order) => order.userId === korisnik?.uid
  );

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!korisnik || mojePorudzbine.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Moje porudžbine</ThemedText>
        </ThemedView>
        <View style={styles.empty}>
          <ThemedText style={styles.emptyText}>
            {korisnik ? 'Nemate porudžbina' : 'Morate biti prijavljeni'}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Moje porudžbine</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        {mojePorudzbine.map((order) => (
          <View key={order.id} style={[styles.orderCard, { borderColor: colors.icon }]}>
            <ThemedText type="defaultSemiBold">Porudžbina #{order.id.slice(0, 8)}</ThemedText>

            <ThemedText style={[styles.status, { color: colors.tint }]}>
              Status: {order.status}
            </ThemedText>

            <ThemedText>
              Ukupno: {order.total.toFixed(2)} RSD
            </ThemedText>

            <View style={styles.itemsContainer}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <ThemedText>{item.product.name}</ThemedText>
                  <ThemedText>x{item.quantity}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  orderCard: {
    borderWidth: 1,
    borderRadius: 8,
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
  status: {
    marginVertical: 4,
    fontSize: 14,
    marginBottom: 8,
  },
  itemsContainer: {
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});