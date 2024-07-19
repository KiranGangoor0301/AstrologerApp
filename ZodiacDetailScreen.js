import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';

export default function ZodiacDetailScreen({ route }) {
  const { sign } = route.params;
  const [loading, setLoading] = useState(true);
  const [zodiacInfo, setZodiacInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchZodiacInfo = async () => {
    try {
      const response = await axios.post(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`);
      setZodiacInfo(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load zodiac information. Please try again later.');
      setLoading(false);
      console.error('API Error:', err);
    }
  };

  useEffect(() => {
    fetchZodiacInfo();
  }, [sign]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => {
          setLoading(true);
          setError(null);
          fetchZodiacInfo();
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{zodiacInfo.sign}</Text>
      <Text style={styles.description}>{zodiacInfo.description}</Text>
      <Text style={styles.date}>{zodiacInfo.date_range}</Text>
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});
