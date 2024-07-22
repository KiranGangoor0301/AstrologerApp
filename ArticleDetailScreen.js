import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const ArticleDetailScreen = ({ route }) => {
  const { article } = route.params;
  const placeholderImage = 'https://via.placeholder.com/400x200.png?text=No+Image+Available';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: article.urlToImage || placeholderImage }} style={styles.image} />
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.author}>{article.author ? `By ${article.author}` : 'Author unknown'}</Text>
      <Text style={styles.publishedAt}>{article.publishedAt ? `Published on: ${new Date(article.publishedAt).toLocaleDateString()}` : 'Date not available'}</Text>
      <Text style={styles.source}>{article.source ? `Source: ${article.source.name}` : 'Source not available'}</Text>
      <Text style={styles.content}>{article.content || 'Content not available'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  publishedAt: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  source: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
});

export default ArticleDetailScreen;
