import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./screens/Login";
import Home from "./screens/Home";
import * as React from "react";
import { MapScreen } from './screens/Map/Map.Screen';
import { MapHome } from './screens/MapHome/MapHome.Screen';
import { SMapScreen } from './screens/Map/SMap.Screen';
import AppNavigation from '../Citizen-Science/src/Navigation';
import {AuthProvider} from './src/util/AuthContext';


const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
          <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
          <Stack.Screen options={{headerShown: false}} name="MapHome" component={MapHome} />
          <Stack.Screen options={{headerShown: false}} name="MapScreen" component={MapScreen} />
          <Stack.Screen options={{headerShown: false}} name="SMapScreen" component={SMapScreen} />

        </Stack.Navigator>
      </NavigationContainer>
      </AuthProvider>
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
