import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker'; // For picking profile pictures

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    // Validate inputs
    if (!email || !password || !name || !age) {
      setErrorMessage('All fields are required.');
      return;
    }

    setLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (profilePicture) {
        const reference = storage().ref(`profilePictures/${user.uid}`);
        await reference.putFile(profilePicture);
        const profilePictureUrl = await reference.getDownloadURL();
        await user.updateProfile({
          displayName: name,
          photoURL: profilePictureUrl,
        });
      } else {
        await user.updateProfile({ displayName: name });
      }

      setMessage('Registration successful');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Registration Error:', error.message);
      setErrorMessage(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorMessage) {
        setProfilePicture(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>Pick Profile Picture</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.inputBox}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.inputBox}
        placeholder="Enter Your Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.inputBox}
        placeholder="Enter Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputBox}
        placeholder="Enter Your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E8F0F2', // Light background color
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  inputBox: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 12,
    padding: 15,
    backgroundColor: '#fff',
    elevation: 2,
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    marginVertical: 15,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#FF4C4C',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#FCE4E4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  message: {
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});
