import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import Sidebar from './Sidebar'; // Import the Sidebar component

const { width: viewportWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [hoveredSign, setHoveredSign] = useState(null);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const bannerImages = [
    require('./pictures/banner1.jpg'),
    require('./pictures/banner2.jpeg'),
    require('./pictures/banner3.png'),
    require('./pictures/banner4.jpeg'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % bannerImages.length;
      setActiveIndex(nextIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: nextIndex * viewportWidth, animated: true });
      }
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

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
        <TouchableOpacity onPress={() => setIsSidebarVisible(true)} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
        <ScrollView 
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const currentIndex = Math.floor(contentOffsetX / viewportWidth);
            setActiveIndex(currentIndex);
          }}
        >
          {bannerImages.map((image, index) => (
            <Image key={index} source={image} style={styles.banner} />
          ))}
        </ScrollView>
        <Text style={styles.welcomeText}>Welcome to Your Astrology App</Text>
        <Text style={styles.dailyHoroscopeTitle}>Daily Horoscope</Text>
        <Text style={styles.dailyHoroscopeText}>
          "Today is a great day to embrace new opportunities and face challenges with confidence."
        </Text>
        <Text style={styles.zodiacTitle}>Zodiac Signs</Text>
        <View style={styles.zodiacContainer}>
          {zodiacSigns.map((sign, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.signCard, 
                hoveredSign === index && styles.signCardHovered
              ]}
              onPress={() => handleSignPress(sign)}
              activeOpacity={0.8}
              onMouseEnter={() => setHoveredSign(index)}
              onMouseLeave={() => setHoveredSign(null)}
            >
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
    backgroundColor: '#E0F7FA',
  },
  content: {
    padding: 20,
  },
  banner: {
    width: viewportWidth,
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
    justifyContent: 'space-between',
  },
  signCard: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    transition: 'all 0.3s ease-in-out',
  },
  signCardHovered: {
    transform: 'scale(1.05)',
    backgroundColor: '#f0f0f0',
  },
  signImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  signName: {
    fontSize: 16,
    color: '#333',
  },
  hamburgerButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 30,
    zIndex: 1001,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerText: {
    fontSize: 24,
    color: '#fff',
  },
});
