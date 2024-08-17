import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const footerItems = [
  { title: 'Home', screen: 'Home', image: require('./pictures/home.jpg') },
  { title: 'Zodiac', screen: 'ZodiacInfo', image: require('./pictures/astro.jpeg') },
  { title: 'Consultation', screen: 'Consultation', image: require('./pictures/consultation.jpeg') },
  { title: 'Articles', screen: 'Articles', image: require('./pictures/article.jpg') },
  { title: 'Yoga', screen: 'Tools', image: require('./pictures/yoga1.png') },
  { title: 'Notifications', screen: 'Notifications', image: require('./pictures/notification.jpeg') }
];

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleFooterPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.footer}>
      {footerItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleFooterPress(item.screen)}
          style={[
            styles.footerItem,
            route.name === item.screen && styles.activeFooterItem,
          ]}
        >
          <Image 
            source={item.image} 
            style={[
              styles.icon,
              route.name === item.screen && styles.activeIcon
            ]}
          />
          <Text style={[
            styles.footerText,
            route.name === item.screen && styles.activeFooterText,
          ]}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 5, // Shadow for footer
    height: 80, // Adjust this height as needed
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFooterItem: {
    backgroundColor: '#e0f7fa', // Highlight background for active page
    borderRadius: 10,
    padding: 10, // Increased padding to accommodate larger icon
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  activeIcon: {
    width: 40, // Increased size for active icon
    height: 40, // Increased size for active icon
  },
  footerText: {
    fontSize: 12, // Increased font size for better readability
    color: '#333',
  },
  activeFooterText: {
    fontWeight: 'bold',
    color: '#00796b', // Highlight color for active page text
  },
});

export default Footer;
