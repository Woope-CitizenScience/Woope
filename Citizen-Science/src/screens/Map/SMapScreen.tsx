import React, { useState, useEffect } from 'react';
import { View, Dimensions} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { mapStyle } from './Map.Style';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface Location {
	latitude: number;
	longitude: number;
}

interface Region {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

export const SMapScreen = () => {
	const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
	const [initialRegion, setInitialRegion] = useState<Region | null>(null);


	useEffect(() => {
		const getLocation = async () => {
			let location = await Location.getCurrentPositionAsync({});
			setCurrentLocation(location.coords);

			setInitialRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			});
		};

		getLocation();
	}, []);

	return (
		<View style={mapStyle.flex}>
			{initialRegion && (
				<MapView style={mapStyle.map} initialRegion={initialRegion}>
					{currentLocation && (
						<Marker
							coordinate={{
								latitude: currentLocation.latitude,
								longitude: currentLocation.longitude,
							}}
							title="Your Location"
						/>
					)}
					<Marker                                                       //hard pin
						coordinate={{latitude: 34.239958, longitude: -118.529187}}    //to be replaced with function that loads pins from pin DB  <Image source = {require("../../../assets/vecteezy_college-graduate-icon")} />
						title="CSUN Library">
					</Marker>
					<Marker                                                       //hard pin
						coordinate={{latitude: 46.085323, longitude: -100.674631}}
						title="BCE College">
					</Marker>
				</MapView>
			)}
		</View>
	);
}