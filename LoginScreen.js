import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      // Your webClientId here (only if using iOS or web)
    });
  }, []);

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setMessage('Login successful');
      navigation.navigate('Home');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      setMessage('Login with Google successful!');
      navigation.navigate('Home');
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

  const handlePhoneLogin = async () => {
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setVerificationId(confirmation.verificationId);
      setIsModalVisible(true);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth().signInWithCredential(credential);
      setMessage('Phone number login successful!');
      setIsModalVisible(false);
      navigation.navigate('Home');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.innerContainer}>
        <Image source={require('./pictures/log.jpg')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
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
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin}>
          <View style={styles.googleContainer}>
            <Image source={require('./pictures/google-logo.png')} style={styles.googleLogo} />
            <Text style={styles.buttonText}>Login with Google</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.phoneButton]} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.buttonText}>Login with Phone Number</Text>
        </TouchableOpacity>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={[styles.button, styles.phoneButton]} onPress={handlePhoneLogin}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    borderWidth: 2,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    borderColor: '#DB4437',
    borderWidth: 2,
    elevation: 2,
  },
  phoneButton: {
    backgroundColor: '#34b7f1',
    borderColor: '#34b7f1',
    borderWidth: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});
