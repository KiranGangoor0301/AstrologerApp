import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      setMessage('User registered successfully');
      navigation.navigate('Login');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      setMessage('Registered with Google successfully!');
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setMessage('User cancelled the login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setMessage('Signing in');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setMessage('Play Services not available');
      } else {
        setMessage('Error: ' + error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.innerContainer}>
        <Image source={require('./pictures/log.jpg')} style={styles.logo} />
        <Text style={styles.title}>Register</Text>
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
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleSignup}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleSignup}>
          <View style={styles.googleContainer}>
            <Image source={require('./pictures/google-logo.png')} style={styles.googleLogo} />
            <Text style={styles.buttonText}>Register with Google</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputBox: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderColor: '#4A90E2',
    borderWidth: 2,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: 'transparent',
    borderColor: '#DB4437',
    borderWidth: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
  },
  googleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  link: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});
