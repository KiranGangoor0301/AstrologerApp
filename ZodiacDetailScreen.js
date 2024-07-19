import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function ZodiacDetailScreen({ route }) {
  const { signName } = route.params;
  const [signInfo, setSignInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignInfo = async () => {
      try {
        // Replace with your actual API key if needed
        const response = await axios.get(`https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${signName}`, {
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY'  // Add your API key here if required
          }
        });
        setSignInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchSignInfo();
  }, [signName]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!signInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to fetch data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* If there's no image URL in the response, you can remove or adjust this part */}
      <Image source={{ uri: signInfo.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{signName}</Text>
      <Text style={styles.description}>{signInfo.prediction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});
