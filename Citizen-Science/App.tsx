import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import * as React from "react";
import { MapScreen } from './screens/Map/Map.Screen';
import { MapHome } from './screens/MapHome/MapHome.Screen';
import { SMapScreen } from './screens/Map/SMap.Screen';


const Stack = createNativeStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
          <Stack.Screen options={{headerShown: false}} name="MapHome" component={MapHome} />
          <Stack.Screen options={{headerShown: false}} name="MapScreen" component={MapScreen} />
          <Stack.Screen options={{headerShown: false}} name="SMapScreen" component={SMapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
