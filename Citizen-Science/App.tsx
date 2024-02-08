import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import  AppNavigation from '../Citizen-Science/src/Navigation';
import * as React from "react";

export default function App() {
  return (
      <NavigationContainer>
          <AppNavigation/>
      </NavigationContainer>
  );
}

