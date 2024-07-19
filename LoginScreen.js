import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      // Your webClientId here (only if using iOS or web)
    });
  }, []);

  const showErrorAlert = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }], { cancelable: true });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setMessage('Login successful');
      navigation.navigate('Home');  // Redirect to home screen
    } catch (err) {
      showErrorAlert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      setMessage('Login with Google successful!');
      navigation.navigate('Home');  // Redirect to home screen
    } catch (error) {
      let errorMessage = 'An error occurred';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'User cancelled the login';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Signing in';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Play Services not available';
      } else {
        errorMessage = 'Error: ' + error.message;
      }
      showErrorAlert('Google Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    setIsPhoneModalVisible(true);
  };

  const sendVerificationCode = async () => {
    setLoading(true);
    try {
      let formattedPhoneNumber = phoneNumber;
      if (!formattedPhoneNumber.startsWith('+91')) {
        formattedPhoneNumber = '+91' + formattedPhoneNumber;
      }
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setVerificationId(confirmation.verificationId);
      setIsPhoneModalVisible(false);
      setIsVerificationModalVisible(true);
    } catch (err) {
      showErrorAlert('Phone Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    setLoading(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth().signInWithCredential(credential);
      setMessage('Phone number login successful!');
      setIsVerificationModalVisible(false);
      navigation.navigate('Home');  // Redirect to home screen
    } catch (err) {
      showErrorAlert('Verification Error', err.message);
    } finally {
      setLoading(false);
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
          accessibilityLabel="Email input"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Your Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password input"
        />
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin} disabled={loading}>
          <View style={styles.googleContainer}>
            <Image source={require('./pictures/google-logo.png')} style={styles.googleLogo} />
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login with Google</Text>}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.phoneButton]} onPress={handlePhoneLogin} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login with Phone Number</Text>}
        </TouchableOpacity>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isPhoneModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter Your Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              accessibilityLabel="Phone number input"
            />
            <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={sendVerificationCode} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Send Verification Code</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsPhoneModalVisible(false)} disabled={loading}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isVerificationModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter Verification Code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
              accessibilityLabel="Verification code input"
            />
            <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={confirmCode} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsVerificationModalVisible(false)} disabled={loading}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  phoneButton: {
    backgroundColor: '#34b7f1',
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
  modalInnerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButton: {
    backgroundColor: '#DB4437',
  },
});
