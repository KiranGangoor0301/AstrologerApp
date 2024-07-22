import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, FlatList, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState(new Date());
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [zodiacVisible, setZodiacVisible] = useState(false);
  const [kundliVisible, setKundliVisible] = useState(false);
  const [genderVisible, setGenderVisible] = useState(false);
  const [selectedZodiac, setSelectedZodiac] = useState('');
  const [selectedKundli, setSelectedKundli] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const kundliOptions = [
    'Kundli A', 'Kundli B', 'Kundli C', 'Kundli D'
  ];

  const genders = [
    'Male', 'Female', 'Other'
  ];

  const handleRegister = async () => {
    if (!email || !password || !name || !dob || !age || !phoneNumber || !selectedZodiac || !selectedKundli || !selectedGender) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    setLoading(true);
    setMessage('');
    setErrorMessage('');
  
    try {
      // Validate age
      const ageNumber = Number(age);
      if (isNaN(ageNumber) || ageNumber <= 0) {
        setErrorMessage('Please enter a valid age.');
        setLoading(false);
        return;
      }
  
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      let profilePictureUrl = null;
      if (profilePicture) {
        const reference = storage().ref(`profilePictures/${user.uid}`);
        await reference.putFile(profilePicture);
        profilePictureUrl = await reference.getDownloadURL();
      }
  
      await user.updateProfile({
        displayName: name,
        photoURL: profilePictureUrl,
      });
  
      const userData = {
        name,
        dob: dob.toISOString().split('T')[0],
        zodiac: selectedZodiac,
        kundli: selectedKundli,
        gender: selectedGender,
        phoneNumber: Number(phoneNumber), // Ensure phone number is stored as number
        profilePicture: profilePictureUrl,
        age: ageNumber, // Ensure age is stored as number
      };
  
      await firestore().collection('users').doc(user.uid).set(userData);
  
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

  const renderOptionItem = (items, setSelected, setVisible) => ({ item }) => (
    <TouchableOpacity style={styles.optionItem} onPress={() => {
      setSelected(item);
      setVisible(false);
    }}>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'<'} Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Register</Text>

      <View style={styles.card}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePickerText}>Pick Profile Picture</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Your Name"
          value={name}
          onChangeText={setName}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.inputBox, styles.halfInput]}
            placeholder="Enter Your Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.inputBox, styles.halfInput]}
            placeholder="Enter Your Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.datePickerText}>
            {dob.toISOString().split('T')[0] || 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setZodiacVisible(true)}
        >
          <Text style={styles.optionText}>
            {selectedZodiac || 'Select Zodiac Sign'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setKundliVisible(true)}
        >
          <Text style={styles.optionText}>
            {selectedKundli || 'Select Kundli'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setGenderVisible(true)}
        >
          <Text style={styles.optionText}>
            {selectedGender || 'Select Gender'}
          </Text>
        </TouchableOpacity>
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
            <Text style={styles.buttonText}>Loading...</Text>
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <Modal
        visible={datePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.datePickerContainer}>
            <DatePicker
              date={dob}
              onDateChange={setDob}
              mode="date"
              textColor="#007BFF"
            />
            <TouchableOpacity style={styles.okButton} onPress={() => setDatePickerVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={zodiacVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setZodiacVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.optionsContainer}>
            <FlatList
              data={zodiacSigns}
              renderItem={renderOptionItem(zodiacSigns, setSelectedZodiac, setZodiacVisible)}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity style={styles.okButton} onPress={() => setZodiacVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={kundliVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setKundliVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.optionsContainer}>
            <FlatList
              data={kundliOptions}
              renderItem={renderOptionItem(kundliOptions, setSelectedKundli, setKundliVisible)}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity style={styles.okButton} onPress={() => setKundliVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={genderVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGenderVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.optionsContainer}>
            <FlatList
              data={genders}
              renderItem={renderOptionItem(genders, setSelectedGender, setGenderVisible)}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity style={styles.okButton} onPress={() => setGenderVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#007BFF',
  },
  inputBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 10,
  },
  message: {
    color: '#28A745',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  optionItem: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#007BFF',
  },
  okButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
