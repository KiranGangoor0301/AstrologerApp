import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HelpUsScreen = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const issues = [
    'Technical Issue',
    'Account Problem',
    'Payment Issue',
    'Feature Request',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!selectedIssue || !description) {
      Alert.alert('Error', 'Please select an issue and provide a description.');
      return;
    }

    try {
      await firestore().collection('helpRequests').add({
        issue: selectedIssue,
        description,
      });
      Alert.alert('Success', 'Your request has been submitted successfully!');
      setSelectedIssue('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'There was an error submitting your request. Please try again.');
      console.error('Error submitting help request:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Help Us Improve</Text>
      <Text style={styles.subHeader}>Let us know what we can do better!</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Select an Issue</Text>
        {issues.map((issue) => (
          <TouchableOpacity
            key={issue}
            style={[
              styles.issueButton,
              selectedIssue === issue && styles.issueButtonSelected,
            ]}
            onPress={() => setSelectedIssue(issue)}
          >
            <Text
              style={[
                styles.issueButtonText,
                selectedIssue === issue && styles.issueButtonTextSelected,
              ]}
            >
              {issue}
            </Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Describe the issue"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={(text) => setDescription(text)}
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  issueButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  issueButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  issueButtonText: {
    fontSize: 16,
    color: '#333',
  },
  issueButtonTextSelected: {
    color: '#fff',
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
});

export default HelpUsScreen;
