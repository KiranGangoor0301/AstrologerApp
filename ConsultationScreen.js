import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './Footer'; // Ensure the correct path

const ConsultationScreen = () => {
  const navigation = useNavigation();

  const astrologers = [
    { id: '1', name: 'Astrologer A', image: 'https://via.placeholder.com/100', specialty: 'Love and Relationships' },
    { id: '2', name: 'Astrologer B', image: 'https://via.placeholder.com/100', specialty: 'Career and Finance' },
    { id: '3', name: 'Astrologer C', image: 'https://via.placeholder.com/100', specialty: 'Health and Wellness' },
    { id: '4', name: 'Astrologer D', image: 'https://via.placeholder.com/100', specialty: 'Spiritual Guidance' },
  ];

  const renderAstrologer = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingDetails', { astrologerId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={astrologers}
        renderItem={renderAstrologer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <Text style={styles.title}>Choose an Astrologer</Text>
        )}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  list: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    width: 300, // Fixed width for all cards
    height: 250, // Fixed height for all cards
    justifyContent: 'space-between', // Space out content vertically
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007BFF',
    marginBottom: 12,
  },
  infoContainer: {
    alignItems: 'center',
    flex: 1, // Use flex to fill available space
    justifyContent: 'center', // Center content vertically
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: '#555',
  },
});

export default ConsultationScreen;
