import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from '../Citizen-Science/src/Navigation';
import {AuthProvider} from './src/util/AuthContext';
import * as React from "react";
import { MapScreen } from './screens/Map/Map.Screen';
import { MapHome } from './screens/MapHome/MapHome.Screen';
import { SMapScreen } from './screens/Map/SMap.Screen';


export default function App() {
	return (
		<AuthProvider>
			<NavigationContainer>
				<AppNavigation/>
			</NavigationContainer>
		</AuthProvider>
	);
}

