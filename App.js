import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import ZodiacDetailScreen from './ZodiacDetailScreen';
import ContactFormScreen from './ContactFormScreen'; // Create this screen
import HelpUsScreen from './HelpUsScreen'; // Create this screen
import AboutUsScreen from './AboutUsScreen'; // Create this screen
import ProfileScreen from './ProfileScreen'; // Create this screen
import SettingsScreen from './SettingsScreen'; // Create this screen

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = () => {
    auth().signOut()
      .then(() => {
        navigation.navigate('Login'); // Navigate to login screen after logout
      })
      .catch(error => {
        Alert.alert('Logout Error', error.message);
      });
  };

  return (
    <SafeAreaView style={styles.drawerContent}>
      <View style={styles.drawerItems}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
          <Text style={styles.drawerItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('ContactForm')}>
          <Text style={styles.drawerItem}>Contact Form</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('HelpUs')}>
          <Text style={styles.drawerItem}>Help Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('AboutUs')}>
          <Text style={styles.drawerItem}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
          <Text style={styles.drawerItem}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Settings')}>
          <Text style={styles.drawerItem}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.drawerItem}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="ContactForm" component={ContactFormScreen} />
      <Drawer.Screen name="HelpUs" component={HelpUsScreen} />
      <Drawer.Screen name="AboutUs" component={AboutUsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ZodiacDetail" component={ZodiacDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItems: {
    paddingHorizontal: 16,
  },
  drawerItem: {
    paddingVertical: 16,
    fontSize: 16,
  },
});
