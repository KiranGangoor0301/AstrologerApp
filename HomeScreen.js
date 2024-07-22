import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Footer from './Footer';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Sidebar from './Sidebar'; // Import the Sidebar component

const { width: viewportWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const translateX = useSharedValue(-300);

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
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    translateX.value = isSidebarVisible ? -300 : 0;
  };

  const animatedSidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
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
        {!isSidebarVisible && (
          <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerButton}>
            <Text style={styles.hamburgerText}>☰</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Horoscope (User's Zodiac)</Text>
          <Text style={styles.sectionContent}>
            "Today is a great day to embrace new opportunities and face challenges with confidence."
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events/Consultations</Text>
          <Text style={styles.sectionContent}>Details about upcoming events and consultations.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
          <Text style={styles.sectionContent}>Customized recommendations for the user based on their preferences.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Articles</Text>
          <Text style={styles.sectionContent}>Articles on various astrology topics that are featured.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Topics</Text>
          <Text style={styles.sectionContent}>Current trending topics in the astrology community.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Astrology Tools</Text>
          <Text style={styles.sectionContent}>Tools and resources available for astrology enthusiasts.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tips</Text>
          <Text style={styles.sectionContent}>Daily astrology tips to enhance the user's experience.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Astrologers</Text>
          <Text style={styles.sectionContent}>Profiles of featured astrologers and their specialties.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book a Consultation</Text>
          <TouchableOpacity style={styles.button} onPress={() => { /* Navigate to consultation screen */ }}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, animatedSidebarStyle]}>
        <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      </Animated.View>

      <Footer /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  bannerContainer: {
    position: 'relative',
    width: viewportWidth,
  },
  banner: {
    width: viewportWidth,
    height: 200,
    // borderRadius: 10,
  },
  hamburgerButton: {
    position: 'absolute',
    // top: 20,
    // left: 10,
    padding: 10,
    borderRadius: 30,
    zIndex: 1000,
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000',
  },
  hamburgerText: {
    fontSize: 30,
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sidebar: {
    width: 300, // Width of the sidebar
    height: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
  },
});
