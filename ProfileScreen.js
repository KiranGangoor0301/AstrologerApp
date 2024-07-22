import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, FlatList, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({});
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
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

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          const data = userDoc.data();
          setProfileData(data);
          setName(data.name || '');
          setAge(data.phoneNumber || '');
          setDob(new Date(data.dob || Date.now()));
          setSelectedZodiac(data.zodiac || '');
          setSelectedKundli(data.kundli || '');
          setSelectedGender(data.gender || '');
          setProfilePicture(data.profilePicture || null);
          // setProfilePicture(data.age || null);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setErrorMessage('Failed to fetch profile data');
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      const user = auth().currentUser;
      if (user) {
        let profilePictureUrl = profilePicture;
        if (profilePicture && profilePicture !== profileData.profilePicture) {
          const reference = storage().ref(`profilePictures/${user.uid}`);
          await reference.putFile(profilePicture);
          profilePictureUrl = await reference.getDownloadURL();
        }

        const updatedData = {
          name,
          dob: dob.toISOString().split('T')[0],
          zodiac: selectedZodiac,
          kundli: selectedKundli,
          gender: selectedGender,
          profilePicture: profilePictureUrl || profilePicture,
          phoneNumber: parseInt(age, 10),
        };

        await firestore().collection('users').doc(user.uid).update(updatedData);

        setMessage('Profile updated successfully');
        setTimeout(() => {
          navigation.navigate('HomeScreen');
        }, 1000);
      }
    } catch (error) {
      console.error('Profile Update Error:', error.message);
      setErrorMessage(`Profile update failed: ${error.message}`);
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

      <Text style={styles.header}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePickerText}>+</Text>
          )}
        </View>
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
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Save</Text>
        )}
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

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
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  message: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#495057',
  },
  imagePicker: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#e9ecef',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  imagePickerText: {
    color: '#007BFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
    color: '#343a40',
  },
  okButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  okButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
