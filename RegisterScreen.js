import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      setMessage('Registration successful');
      navigation.navigate('Home');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>
    </View>
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
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
