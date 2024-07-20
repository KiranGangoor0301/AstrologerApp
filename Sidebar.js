import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Sidebar = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Login', screen: 'Login', key: 'login' },
    { title: 'Profile', screen: 'Profile', key: 'profile' },
    { title: 'Settings', screen: 'Settings', key: 'settings' },
    { title: 'Help Us', screen: 'HelpUs', key: 'helpus' },
    { title: 'About Us', screen: 'AboutUs', key: 'aboutus' },
    { title: 'Contact', screen: 'Contact', key: 'contact' },
    { title: 'Logout', key: 'logout' }
  ];

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login'); // or 'RegisterScreen' if you want to navigate to the register screen
      onClose();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const handleMenuItemPress = (item) => {
    if (item.key === 'logout') {
      handleLogout();
    } else {
      handleNavigate(item.screen);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.sidebarContainer}>
        <View style={styles.sidebarContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.profileSection}>
            <Image source={require('./pictures/profile.png')} style={styles.profileImage} />
            <Text style={styles.profileName}>John Doe</Text>
          </View>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item)}
              >
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = ({
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
