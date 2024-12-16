{/*import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import {Appbar} from 'react-native-paper';
import {Card, Button} from 'react-native-paper';
import * as Location from 'expo-location';
import {useState} from 'react';
import {HomePage} from './MapHome.Style'

interface MapPageScreenProps {
	navigation: any;
}

export const MapHome = (props: MapPageScreenProps) => {
	const [location, setLocation] =useState({})
	const getLocation = () => {
		(async() => {
			let {status} = await Location.requestForegroundPermissionsAsync()
			if (status == 'granted'){
				console.log('Permission successful!')
			} else {
				console.log('Permission denied')
			}
			const loc = await Location.getCurrentPositionAsync()
			console.log(loc)
			setLocation(loc)
		})()
	};
	const ViewMap = () => props.navigation.navigate('MapScreen');
	const ViewSMap = () => props.navigation.navigate('SMapScreen');

	return(
		<SafeAreaView style = {HomePage.content}>
			<ScrollView style = {HomePage.view}>
				<Appbar>
					<Appbar.BackAction />
					<Appbar.Content title = "Map"/>
				</Appbar>
				<Card>
					<Card.Content>
						<Button
							mode="contained"
							onPress={() => {
								getLocation();
								ViewMap();
							}}
						>Place pin</Button>
						<Button
							mode="contained"
							onPress={() => {
								ViewSMap();
							}}
						>View Map</Button>
					</Card.Content>
				</Card>
			</ScrollView>
		</SafeAreaView>
	);
}
	*/}
import React from 'react';
import { SafeAreaView } from 'react-native';
import { MapScreen } from './MapScreen'; // Import the MapScreen component directly

export const MapHome = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<MapScreen /> {/* Render the MapScreen directly */}
		</SafeAreaView>
	);
};
