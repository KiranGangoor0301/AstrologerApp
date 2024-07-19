// DrawerContent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

export default function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <Text style={styles.drawerTitle}>Menu</Text>
        <DrawerItem
          label="Contact Form"
          onPress={() => props.navigation.navigate('ContactForm')}
        />
        <DrawerItem
          label="Help Us"
          onPress={() => props.navigation.navigate('HelpUs')}
        />
        <DrawerItem
          label="About Us"
          onPress={() => props.navigation.navigate('AboutUs')}
        />
        <DrawerItem
          label="Profile"
          onPress={() => props.navigation.navigate('Profile')}
        />
        <DrawerItem
          label="Settings"
          onPress={() => props.navigation.navigate('Settings')}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
