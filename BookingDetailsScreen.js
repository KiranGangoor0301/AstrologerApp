import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';

const BookingDetailsScreen = ({ route, navigation }) => {
  const { astrologerId } = route.params;

  const astrologersMock = [
    { id: '1', name: 'Astrologer A', image: 'https://via.placeholder.com/100', specialty: 'Love and Relationships' },
    { id: '2', name: 'Astrologer B', image: 'https://via.placeholder.com/100', specialty: 'Career and Finance' },
    { id: '3', name: 'Astrologer C', image: 'https://via.placeholder.com/100', specialty: 'Health and Wellness' },
    { id: '4', name: 'Astrologer D', image: 'https://via.placeholder.com/100', specialty: 'Spiritual Guidance' },
  ];

  const astrologer = astrologersMock.find(a => a.id === astrologerId);

  const [consultationDate, setConsultationDate] = useState(new Date());
  const [consultationTime, setConsultationTime] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const handleProceedToPayment = () => {
    alert('Proceeding to payment');
    navigation.navigate('Payment', { 
      astrologerId, 
      consultationDate: consultationDate.toISOString().split('T')[0], 
      consultationTime: consultationTime.toTimeString().split(' ')[0] 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: astrologer.image }} style={styles.image} />
        <Text style={styles.name}>{astrologer.name}</Text>
        <Text style={styles.specialty}>{astrologer.specialty}</Text>
      </View>
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setCalendarVisible(true)}
        >
          <Text style={styles.inputText}>
            {consultationDate.toISOString().split('T')[0] || 'Select Consultation Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setTimePickerVisible(true)}
        >
          <Text style={styles.inputText}>
            {consultationTime.toTimeString().split(' ')[0] || 'Select Consultation Time'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleProceedToPayment}>
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={calendarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <DatePicker
              date={consultationDate}
              onDateChange={setConsultationDate}
              mode="date"
              textColor="#007BFF"
            />
            <TouchableOpacity style={styles.okButton} onPress={() => setCalendarVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={timePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <DatePicker
              date={consultationTime}
              onDateChange={setConsultationTime}
              mode="time"
              textColor="#007BFF"
            />
            <TouchableOpacity style={styles.okButton} onPress={() => setTimePickerVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookingDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Slightly lighter background color for a modern feel
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Slightly larger border radius for a more modern card design
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Increased shadow for a more pronounced card effect
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  image: {
    width: 120, // Slightly larger image for better visibility
    height: 120,
    borderRadius: 60, // Ensures image is perfectly circular
    marginBottom: 12,
  },
  name: {
    fontSize: 20, // Slightly larger font size for the name
    fontWeight: 'bold',
    color: '#333', // Darker color for better contrast
  },
  specialty: {
    fontSize: 16, // Adjusted font size
    color: '#666', // Slightly lighter color for the specialty text
    marginBottom: 16,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Slightly rounded corners
    padding: 14, // Increased padding for more space
    marginBottom: 20, // Increased margin for better spacing
    borderWidth: 1,
    borderColor: '#CED4DA',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 18, // Larger font size for input text
    color: '#333', // Darker text color for better readability
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 10, // Rounded corners for a more modern button design
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18, // Slightly larger font size for button text
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Slightly darker overlay for better contrast
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Match card design
    padding: 20, // Increased padding for the calendar modal
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  okButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10, // Match button design
    padding: 12,
    alignItems: 'center',
    marginTop: 20, // Increased margin for spacing
    width: 120, // Wider button
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 18, // Match button text size
    fontWeight: 'bold',
  },
});
