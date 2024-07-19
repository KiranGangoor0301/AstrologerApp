// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // Import Firebase Authentication

export default function HomeScreen() {
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
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Text style={styles.menuText}>☰ Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
  menuButton: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    marginBottom: 20,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#E94E77',
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});
