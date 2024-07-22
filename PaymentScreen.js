import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { astrologerId, consultationDate, consultationTime } = route.params;

  const handlePayment = () => {
    // Here you would integrate with a payment gateway and handle payment logic
    alert('Payment successful!');
    // Navigate back to home or consultation confirmation screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Astrologer ID:</Text>
          <Text style={styles.value}>{astrologerId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Consultation Date:</Text>
          <Text style={styles.value}>{consultationDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Consultation Time:</Text>
          <Text style={styles.value}>{consultationTime}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 18,
    color: '#555',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
