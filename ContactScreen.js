import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ContactScreen = () => {
  const [contactDetails, setContactDetails] = useState({ email: '', phone: '', description: '' });
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      await firestore().collection('contacts').add(contactDetails);
      Alert.alert('Success', 'Your message has been sent successfully!');
      setContactDetails({ email: '', phone: '', description: '' });
    } catch (error) {
      Alert.alert('Error', 'There was an error sending your message. Please try again.');
      console.error('Error submitting contact details:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Contact Us</Text>
      <Text style={styles.subHeader}>We’d love to hear from you!</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={contactDetails.email}
          onChangeText={(text) => setContactDetails({ ...contactDetails, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#888"
          value={contactDetails.phone}
          onChangeText={(text) => setContactDetails({ ...contactDetails, phone: text })}
        />
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Description"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={contactDetails.description}
          onChangeText={(text) => setContactDetails({ ...contactDetails, description: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  description: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactScreen;
