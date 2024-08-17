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
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your web client ID
    });
  }, []);

  const showErrorAlert = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }], { cancelable: true });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter valid email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setMessage('');
    setLoadingLogin(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (err) {
      showErrorAlert('Login Error', err.message);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('Home');
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
      setLoadingGoogle(false);
    }
  };

  const handlePhoneLogin = () => {
    setIsPhoneModalVisible(true);
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      setMessage('Please enter your phone number.');
      return;
    }

    setMessage('');
    setLoadingPhone(true);
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setVerificationId(confirmation.verificationId);
      setIsPhoneModalVisible(false);
      setIsVerificationModalVisible(true);
    } catch (err) {
      showErrorAlert('Phone Login Error', err.message);
    } finally {
      setLoadingPhone(false);
    }
  };

  const confirmCode = async () => {
    if (!verificationCode) {
      setMessage('Please enter the verification code.');
      return;
    }

    setMessage('');
    setLoadingPhone(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth().signInWithCredential(credential);
      navigation.navigate('Home');
    } catch (err) {
      showErrorAlert('Verification Error', err.message);
    } finally {
      setLoadingPhone(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.innerContainer}>
        <Image source={require('./pictures/astro.jpeg')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <Image source={require('./pictures/user.png')} style={styles.icon} />
          <TextInput
            style={styles.inputBox}
            placeholder="Enter Your Email"
            placeholderTextColor="black"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email input"
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('./pictures/pass.png')} style={styles.icon} />
          <TextInput
            style={styles.inputBox}
            placeholder="Enter Your Password"
            placeholderTextColor="black"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            accessibilityLabel="Password input"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Image source={passwordVisible ? require('./pictures/eye.png') : require('./pictures/eye.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin} disabled={loadingLogin || loadingGoogle || loadingPhone}>
          {loadingLogin ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin} disabled={loadingLogin || loadingGoogle || loadingPhone}>
          <View style={styles.googleContainer}>
            <Image source={require('./pictures/google-logo.png')} style={styles.googleLogo} />
            {loadingGoogle ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login with Google</Text>}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.phoneButton]} onPress={handlePhoneLogin} disabled={loadingLogin || loadingGoogle || loadingPhone}>
          {loadingPhone ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login with Phone Number</Text>}
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
              placeholderTextColor="black"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              accessibilityLabel="Phone number input"
            />
            <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={sendVerificationCode} disabled={loadingPhone}>
              {loadingPhone ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Send Verification Code</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsPhoneModalVisible(false)} disabled={loadingPhone}>
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
              placeholderTextColor="black"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
              accessibilityLabel="Verification code input"
            />
            <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={confirmCode} disabled={loadingPhone}>
              {loadingPhone ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsVerificationModalVisible(false)} disabled={loadingPhone}>
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
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputBox: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color:'black',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#007bff',
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  phoneButton: {
    backgroundColor: '#34b7f1',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  googleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginTop: 10,
  },
});