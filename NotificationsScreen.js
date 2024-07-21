import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import
import { setupForegroundNotifications } from './NotificationService'; // Ensure correct path
import Toast from 'react-native-toast-message'; // Import toast library

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [animating, setAnimating] = useState({}); // Store animation states for notifications
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());

  useEffect(() => {
    // Load dismissed notifications from local storage
    const loadDismissedNotifications = async () => {
      try {
        const storedDismissed = await AsyncStorage.getItem('dismissedNotifications');
        if (storedDismissed) {
          setDismissedNotifications(new Set(JSON.parse(storedDismissed)));
        }
      } catch (error) {
        console.error('Error loading dismissed notifications:', error);
      }
    };

    loadDismissedNotifications();

    // Setup notifications
    setupForegroundNotifications((newNotifications) => {
      // Get the current time
      const now = new Date();
      const threeDaysAgo = now.getTime() - (3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds

      // Remove notifications older than 3 days
      const validNotifications = newNotifications.filter(notification => {
        const notificationTime = new Date(notification.sentTime).getTime();
        return notificationTime >= threeDaysAgo;
      });

      // Ensure notifications are unique based on title and sentTime
      const uniqueNotifications = validNotifications.filter((notification, index, self) =>
        index === self.findIndex((t) => t.notification.title === notification.notification.title && t.sentTime === notification.sentTime)
      );

      // Exclude dismissed notifications
      const filteredNotifications = uniqueNotifications.filter(notification => !dismissedNotifications.has(notification.sentTime));

      // Sort notifications by sentTime in descending order
      const sortedNotifications = filteredNotifications.sort((a, b) => new Date(b.sentTime) - new Date(a.sentTime));

      setNotifications(sortedNotifications);
      setAnimating(sortedNotifications.reduce((acc, item) => ({ ...acc, [item.sentTime]: new Animated.Value(1) }), {})); // Initialize animations
    });

    // Optionally: cleanup when the component unmounts
    return () => {
      // Perform cleanup if necessary
    };
  }, [dismissedNotifications]);

  const handleDismiss = async (sentTime) => {
    const animation = animating[sentTime];
    
    // Start the animation
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      // Update dismissed notifications state
      setDismissedNotifications(prevSet => {
        const newSet = new Set(prevSet);
        newSet.add(sentTime);
        return newSet;
      });

      // Save updated dismissed notifications to local storage
      try {
        await AsyncStorage.setItem('dismissedNotifications', JSON.stringify(Array.from(dismissedNotifications)));
      } catch (error) {
        console.error('Error saving dismissed notifications:', error);
      }

      // Remove the notification from the UI
      setNotifications(prevNotifications => prevNotifications.filter(notification => notification.sentTime !== sentTime));

      // Show a toast notification
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Notification Deleted',
      });
    });
  };

  const renderNotificationItem = ({ item }) => {
    const animation = animating[item.sentTime];

    return (
      <Animated.View style={[styles.card, { opacity: animation }]}>
        <TouchableOpacity style={styles.closeButton} onPress={() => handleDismiss(item.sentTime)}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.cardHeader}>
          <Image source={require('./pictures/astro.jpeg')} style={styles.icon} />
          <Text style={styles.cardTitle}>{item.notification.title || 'No Title'}</Text>
        </View>
        <Text style={styles.cardBody}>{item.notification.body || 'No Body'}</Text>
        <Text style={styles.cardTime}>Received at: {new Date(item.sentTime).toLocaleString()}</Text>
      </Animated.View>
    );
  };

  const footerItems = [
    { title: 'Home', screen: 'Home', image: require('./pictures/home.jpg') },
    { title: 'Zodiac Info', screen: 'ZodiacInfo', image: require('./pictures/astro.jpeg') },
    { title: 'Consultation', screen: 'Consultation', image: require('./pictures/consultation.jpeg') },
    { title: 'Articles', screen: 'Articles', image: require('./pictures/article.jpg') },
    { title: 'Tools', screen: 'Tools', image: require('./pictures/tools.jpeg') },
    { title: 'Notifications', screen: 'Notifications', image: require('./pictures/notification.jpeg') }
  ];

  const handleFooterPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.sentTime.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications available.</Text>}
      />
      <View style={styles.footer}>
        {footerItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleFooterPress(item.screen)}
            style={styles.footerItem}
          >
            <Image source={item.image} style={styles.footerImage} />
            <Text style={styles.footerText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F9', // Light gray-blue background
    justifyContent: 'space-between', // Push footer to the bottom
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50', // Dark blue-gray
    marginBottom: 20,
  },
  list: {
    flexGrow: 1, // Allows the FlatList to take up remaining space
    paddingBottom: 60, // Padding to avoid overlap with the footer
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7', // Light gray
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#BDC3C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5, // For Android shadow
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E', // Dark blue-gray
    flex: 1,
  },
  cardBody: {
    fontSize: 15,
    color: '#7F8C8D', // Gray
    marginVertical: 10,
  },
  cardTime: {
    fontSize: 13,
    color: '#95A5A6', // Very light gray
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ff4d4d', // Red color for close button
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    width: '100%',
    elevation: 5, // Shadow for footer
  },
  footerItem: {
    alignItems: 'center',
  },
  footerImage: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#333',
  },
});
