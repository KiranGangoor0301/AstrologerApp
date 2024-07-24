import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import Footer from './Footer'; // Ensure the correct path

const zodiacSigns = [
  { id: '1', name: 'Aries', image: require('./pictures/aries1.png'), dateRange: 'March 21 - April 19', element: 'Fire', ruler: 'Mars' },
  { id: '2', name: 'Taurus', image: require('./pictures/taurus.png'), dateRange: 'April 20 - May 20', element: 'Earth', ruler: 'Venus' },
  { id: '3', name: 'Gemini', image: require('./pictures/gemini.png'), dateRange: 'May 21 - June 20', element: 'Air', ruler: 'Mercury' },
  { id: '4', name: 'Cancer', image: require('./pictures/cancer.png'), dateRange: 'June 21 - July 22', element: 'Water', ruler: 'Moon' },
  { id: '5', name: 'Leo', image: require('./pictures/leo.png'), dateRange: 'July 23 - August 22', element: 'Fire', ruler: 'Sun' },
  { id: '6', name: 'Virgo', image: require('./pictures/virgo.png'), dateRange: 'August 23 - September 22', element: 'Earth', ruler: 'Mercury' },
  { id: '7', name: 'Libra', image: require('./pictures/libra.png'), dateRange: 'September 23 - October 22', element: 'Air', ruler: 'Venus' },
  { id: '8', name: 'Scorpio', image: require('./pictures/scorpio.png'), dateRange: 'October 23 - November 21', element: 'Water', ruler: 'Pluto' },
  { id: '9', name: 'Sagittarius', image: require('./pictures/sagittarius.png'), dateRange: 'November 22 - December 21', element: 'Fire', ruler: 'Jupiter' },
  { id: '10', name: 'Capricorn', image: require('./pictures/capricorn.png'), dateRange: 'December 22 - January 19', element: 'Earth', ruler: 'Saturn' },
  { id: '11', name: 'Aquarius', image: require('./pictures/aquarius.png'), dateRange: 'January 20 - February 18', element: 'Air', ruler: 'Uranus' },
  { id: '12', name: 'Pisces', image: require('./pictures/pisces.png'), dateRange: 'February 19 - March 20', element: 'Water', ruler: 'Neptune' },
];

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30; // Adjust the width for 2 columns with some margin

export default function ZodiacInfoScreen({ navigation }) {
  const handlePress = (sign) => {
    navigation.navigate('ZodiacDetail', { sign });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.name)}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>{item.dateRange}</Text>
        <Text style={styles.info}>{item.element} Element</Text>
        <Text style={styles.info}>Ruler: {item.ruler}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Explore Your Zodiac Sign</Text>
        <Text style={styles.subtitle}>Discover the traits, elements, and rulers of each zodiac sign.</Text>
        <FlatList
          data={zodiacSigns}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2E3A59',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderColor: '#D1D8E0',
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#5A5A5A',
  },
});
