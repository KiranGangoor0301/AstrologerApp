import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const footerItems = [
  { title: 'Home', screen: 'Home', image: require('./pictures/home.jpg') },
  { title: 'Zodiac Info', screen: 'ZodiacInfo', image: require('./pictures/astro.jpeg') },
  { title: 'Consultation', screen: 'Consultation', image: require('./pictures/consultation.jpeg') },
  { title: 'Articles', screen: 'Articles', image: require('./pictures/article.jpg') },
  { title: 'Yoga', screen: 'Tools', image: require('./pictures/yoga1.png') },
  { title: 'Notifications', screen: 'Notifications', image: require('./pictures/notification.jpeg') }
];

const Footer = () => {
  const navigation = useNavigation();

  const handleFooterPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.card}>
      <View style={styles.footer}>
        {footerItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleFooterPress(item.screen)}
            style={styles.footerItem}
          >
            <Image source={item.image} style={styles.icon} />
            <Text style={styles.footerText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 5,
    shadowColor: '#BDC3C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#333',
  },
});

export default Footer;
