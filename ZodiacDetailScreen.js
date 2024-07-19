import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function ZodiacDetailScreen({ route }) {
  const { sign } = route.params;
  const [loading, setLoading] = useState(true);
  const [zodiacInfo, setZodiacInfo] = useState(null);

  useEffect(() => {
    // Fetch zodiac sign information from the API
    fetch(`https://example.com/api/zodiac/${sign}`)
      .then(response => response.json())
      .then(data => {
        setZodiacInfo(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [sign]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!zodiacInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load information. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{zodiacInfo.name}</Text>
      <Text style={styles.description}>{zodiacInfo.description}</Text>
      {/* Add more information as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
