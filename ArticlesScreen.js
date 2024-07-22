import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Footer from './Footer'; // Ensure the correct path

const ArticlesScreen = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const placeholderImage = 'https://via.placeholder.com/400x200.png?text=No+Image+Available';

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          apiKey: 'c46b6e3f0eff44da81fb7d1e45539416', // Your NewsAPI key
        },
      });
      setArticles(response.data.articles);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ArticleDetail', { article: item })}>
      <Image source={{ uri: item.urlToImage || placeholderImage }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <Text style={styles.screenTitle}>Latest News</Text>
        )}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007BFF',
    marginVertical: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default ArticlesScreen;
