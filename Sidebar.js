import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Sidebar = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(-300)).current; // Sidebar width

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const menuItems = [
    { title: 'Profile', screen: 'Profile' },
    { title: 'Settings', screen: 'Settings' },
    { title: 'Help Us', screen: 'HelpUs' },
    { title: 'About Us', screen: 'AboutUs' },
    { title: 'Contact', screen: 'Contact' },
    { title: 'Logout', action: () => handleLogout() }
  ];

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
    onClose();
  };

  const handleLogout = () => {
    // Add logout functionality here
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.sidebarContainer}>
        <Animated.View style={[styles.sidebarContent, { transform: [{ translateX }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.profileSection}>
            <Image source={require('./pictures/profile.png')} style={styles.profileImage} />
            <Text style={styles.profileName}>John Doe</Text>
          </View>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => item.action ? item.action() : handleNavigate(item.screen)}
              >
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    right: 4,
    zIndex: 1,
    padding: 10,
    // backgroundColor: '#E0E0E0',
    // borderRadius: 50,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Sidebar;
