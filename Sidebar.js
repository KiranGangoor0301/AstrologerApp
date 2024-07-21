import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const Sidebar = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const translateX = useSharedValue(-300);

  React.useEffect(() => {
    translateX.value = isVisible ? 0 : -300;
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const menuItems = [
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
      navigation.navigate('Login');
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
    <Animated.View style={[styles.sidebarContainer, animatedStyle]}>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    zIndex: 1000,
  },
  sidebarContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
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
