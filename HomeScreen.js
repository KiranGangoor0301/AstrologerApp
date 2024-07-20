import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import Sidebar from './Sidebar'; // Import the Sidebar component

export default function HomeScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigation = useNavigation();

  const zodiacSigns = [
    { name: 'Aries', image: require('./pictures/aries1.png') },
    { name: 'Taurus', image: require('./pictures/taurus.png') },
    { name: 'Gemini', image: require('./pictures/gemini.png') },
    { name: 'Cancer', image: require('./pictures/cancer.png') },
    { name: 'Leo', image: require('./pictures/leo.png') },
    { name: 'Virgo', image: require('./pictures/virgo.png') },
    { name: 'Libra', image: require('./pictures/libra.png') },
    { name: 'Scorpio', image: require('./pictures/scorpio.png') },
    { name: 'Sagittarius', image: require('./pictures/sagittarius.png') },
    { name: 'Capricorn', image: require('./pictures/capricorn.png') },
    { name: 'Aquarius', image: require('./pictures/aquarius.png') },
    { name: 'Pisces', image: require('./pictures/pisces.png') },
  ];

  const handleSignPress = (sign) => {
    navigation.navigate('ZodiacDetail', { sign: sign.name.toLowerCase() });
    setIsSidebarVisible(false); // Close the sidebar when navigating
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            auth()
              .signOut()
              .then(() => {
                navigation.navigate('Login');
              })
              .catch(error => {
                console.error('Sign Out Error', error);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Sidebar isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setIsSidebarVisible(true)} style={styles.hamburgerButton}><Text style={styles.hamburgerText}>☰</Text></TouchableOpacity>
        <Image source={require('./pictures/astrology-banner.jpeg')} style={styles.banner} />
        <Text style={styles.welcomeText}>Welcome to Your Astrology App</Text>
        <Text style={styles.dailyHoroscopeTitle}>Daily Horoscope</Text>
        <Text style={styles.dailyHoroscopeText}>
          "Today is a great day to embrace new opportunities and face challenges with confidence."
        </Text>
        <Text style={styles.zodiacTitle}>Zodiac Signs</Text>
        <View style={styles.zodiacContainer}>
          {zodiacSigns.map((sign, index) => (
            <TouchableOpacity key={index} style={styles.signCard} onPress={() => handleSignPress(sign)}>
              <Image source={sign.image} style={styles.signImage} />
              <Text style={styles.signName}>{sign.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E0F7FA', // Background color of the container
  },
  content: {
    padding: 20,
    backgroundColor: '#E0F7FA', // Background color of the content area
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dailyHoroscopeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 10,
  },
  dailyHoroscopeText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  zodiacTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 10,
  },
  horizontalLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#000', // Black color for horizontal lines
    marginVertical: 20,
  },
  zodiacContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  signCard: {
    alignItems: 'center',
    margin: 10,
  },
  signImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  signName: {
    fontSize: 16,
    color: '#333',
  },
  hamburgerButton: {
    position: 'absolute',
    top: 4, // Adjust this value to position it higher or lower
    // left: 1,
    padding: 15,
    // backgroundColor: '#4A90E2',
    borderRadius: 30,
    zIndex: 1001,
    width: 70,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerText: {
    fontSize: 30,
    color: '#fff',
  },
});
