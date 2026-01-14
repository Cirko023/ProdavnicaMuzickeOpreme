import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Dozvola za notifikacije nije data');
      return null;
    }
    
    // Ne tražimo Expo Push Token jer zahteva projectId
    // Lokalne notifikacije rade bez push tokena
    return true;
  } catch (error) {
    console.log('Greška pri registraciji notifikacija:', error);
    return null;
  }
};

export const scheduleOrderNotification = async (orderId: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Porudžbina kreirana!',
        body: `Vaša porudžbina #${orderId.slice(0, 8)} je uspešno kreirana.`,
        data: { orderId },
      },
      trigger: null,
    });
  } catch (error) {
    console.log('Greška pri slanju notifikacije:', error);
  }
};

export const scheduleStatusUpdateNotification = async (orderId: string, status: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Status porudžbine ažuriran',
        body: `Status vaše porudžbine #${orderId.slice(0, 8)} je promenjen na: ${status}`,
        data: { orderId, status },
      },
      trigger: null,
    });
  } catch (error) {
    console.log('Greška pri slanju notifikacije:', error);
  }
};
