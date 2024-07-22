import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const CustomDatePicker = ({ visible, onClose, onDateSelected }) => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [showPicker, setShowPicker] = useState('month'); // month, day, year

  const handleConfirm = () => {
    onDateSelected(date);
    onClose();
  };

  const handleDateChange = (value, type) => {
    const newDate = moment(date).set(type, value).format('YYYY-MM-DD');
    setDate(newDate);
  };

  const generateOptions = (type) => {
    let options = [];
    if (type === 'year') {
      options = Array.from({ length: 50 }, (_, i) => (1970 + i).toString());
    } else if (type === 'month') {
      options = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    } else if (type === 'day') {
      const daysInMonth = moment(date).daysInMonth();
      options = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    }
    return options;
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Select Date</Text>
          {showPicker === 'year' && (
            <Picker
              selectedValue={moment(date).format('YYYY')}
              onValueChange={(itemValue) => handleDateChange(itemValue, 'year')}
            >
              {generateOptions('year').map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          )}
          {showPicker === 'month' && (
            <Picker
              selectedValue={moment(date).format('MM')}
              onValueChange={(itemValue) => handleDateChange(itemValue, 'month')}
            >
              {generateOptions('month').map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          )}
          {showPicker === 'day' && (
            <Picker
              selectedValue={moment(date).format('DD')}
              onValueChange={(itemValue) => handleDateChange(itemValue, 'date')}
            >
              {generateOptions('day').map((day) => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => setShowPicker('year')} style={styles.button}>
              <Text style={styles.buttonText}>Year</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPicker('month')} style={styles.button}>
              <Text style={styles.buttonText}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPicker('day')} style={styles.button}>
              <Text style={styles.buttonText}>Day</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  button: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 5,
  },
  buttonText: {
    color: '#4A90E2',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomDatePicker;
