// PoseDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const PoseDetailScreen = ({ route }) => {
  const { pose } = route.params;

  if (!pose) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pose details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title} Yoga Details>{pose.english_name}</Text>
        <Text style={styles.sanskritName}>{pose.sanskrit_name_adapted}</Text>
      </View>

      {pose.url_png ? (
        <Image source={{ uri: pose.url_png }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No image available</Text>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Description:</Text>
        <Text style={styles.description}>{pose.pose_description}</Text>

        <Text style={styles.sectionTitle}>Benefits:</Text>
        <Text style={styles.benefits}>{pose.pose_benefits}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E3A59',
    marginBottom: 10,
    textAlign: 'center',
  },
  sanskritName: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  benefits: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default PoseDetailScreen;
