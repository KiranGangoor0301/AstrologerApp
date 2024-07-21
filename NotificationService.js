// NotificationService.js
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Create a global array to store notifications
let notifications = [];

// Request permission for notifications (iOS only)
export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
      // Get the FCM token after permission is granted
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } else {
      console.log('Notification permissions not granted');
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
}

// Handle foreground notifications
export function setupForegroundNotifications(setNotificationCallback) {
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    notifications.push(remoteMessage);
    if (setNotificationCallback) {
      setNotificationCallback([...notifications]);
    }
  });
}

// Handle background and terminated state notifications
export async function handleBackgroundNotifications(remoteMessage) {
  console.log('Message handled in the background!', JSON.stringify(remoteMessage));
  notifications.push(remoteMessage);
}

// Set the background message handler
messaging().setBackgroundMessageHandler(handleBackgroundNotifications);
