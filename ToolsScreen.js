// YogaScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Footer from './Footer'; // Import Footer component

const YogaScreen = ({ navigation }) => {
  const [poses, setPoses] = useState([]);
  const [selectedPoses, setSelectedPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoses = async () => {
      try {
        const response = await axios.get('https://yoga-api-nzy4.onrender.com/v1/poses');
        const allPoses = response.data;
        setPoses(allPoses);
        selectDailyPoses(allPoses);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch poses', error);
        setError('Failed to fetch yoga poses. Please try again later.');
        setLoading(false);
      }
    };

    fetchPoses();
  }, []);

  const selectDailyPoses = (allPoses) => {
    if (allPoses.length > 0) {
      const today = new Date();
      const seed = today.getDate() + today.getMonth() + today.getFullYear();
      const randomIndexes = generateRandomIndexes(seed, 6, allPoses.length);

      const uniquePoses = randomIndexes.map(index => allPoses[index]);
      setSelectedPoses(uniquePoses);
    }
  };

  const generateRandomIndexes = (seed, count, max) => {
    const indexes = new Set();
    const random = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    while (indexes.size < count && indexes.size < max) {
      const index = Math.floor(random(seed) * max);
      indexes.add(index);
      seed += 1;
    }

    return Array.from(indexes);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Yoga Poses for Today</Text>
        {selectedPoses.map((pose) => (
          <TouchableOpacity
            key={pose.id}
            style={styles.poseContainer}
            onPress={() => navigation.navigate('PoseDetail', { pose })}
          >
            <Text style={styles.poseName}>{pose.english_name}</Text>
            <Text style={styles.briefDescription}>{pose.pose_description.substring(0, 100) + '...'}</Text>
            {pose.url_png && <Image source={{ uri: pose.url_png }} style={styles.image} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Footer /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollViewContent: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E3A59',
    marginVertical: 20,
    textAlign: 'center',
  },
  poseContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3E6E8',
  },
  poseName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  briefDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default YogaScreen;
