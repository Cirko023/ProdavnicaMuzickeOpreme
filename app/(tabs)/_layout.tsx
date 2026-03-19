import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const stavke = useSelector((state: RootState) => state.cart.stavke);
  const brojStavki = stavke.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="gitare"
        options={{
          title: 'Gitare',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="guitar-electric" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pedale"
        options={{
          title: 'Pedale',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="slider.horizontal.3" color={color} />,
        }}
      />
      <Tabs.Screen
        name="oprema"
        options={{
          title: 'Oprema',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bag.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Korpa',
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={28} name="cart.fill" color={color} />
              {brojStavki > 0 && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>{brojStavki > 9 ? '9+' : brojStavki}</ThemedText>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
