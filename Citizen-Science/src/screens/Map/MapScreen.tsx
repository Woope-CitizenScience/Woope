import React, { useState, useEffect } from 'react';
import { SafeAreaView, Dimensions, Image } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { mapStyle } from './Map.Style';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const customMarkerImage = require('../../../assets/College_marker.png');

const markersData = [
	{ title: "CSUN Library", coordinate: { latitude: 34.239958, longitude: -118.529187 } },
	{ title: "BCE College", coordinate: { latitude: 46.085323, longitude: -100.674631 } },
];

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



export const MapScreen = () => {
	const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
	const [initialRegion, setInitialRegion] = useState<Region | null>(null);
	const [markerCoordinate, setMarkerCoordinate] = useState(null);

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

	const handleMapPress = (event: { nativeEvent: { coordinate: any; }; }) => {
		const { coordinate } = event.nativeEvent;
		setMarkerCoordinate(coordinate);
	};

	return (
		<SafeAreaView style={mapStyle.flex}>
			{initialRegion && (
				<MapView style={mapStyle.map} initialRegion={initialRegion} onPress={handleMapPress}>
					{currentLocation && (
						<Marker
							coordinate={{
								latitude: currentLocation.latitude,
								longitude: currentLocation.longitude,
							}}
							title="Your Location"
						/>
					)}
					{markersData.map((marker, index) => (
						<Marker
							key={index}
							coordinate={marker.coordinate}
							title={marker.title}
						>
							<Image source={customMarkerImage} style={{ width: 30, height: 30 }} //image credited to Vecteezy.com. Artist Muttaki Al Muhtadi. (Do not remove this comment or we can be sued. Seriously DO NOT REMOVE!!!)
							/>
						</Marker>
					))}
					{markerCoordinate && (
						<Marker
							pinColor='aqua'
							coordinate={markerCoordinate}
							title="Dynamic Marker"
							description="This marker updates on press"
						/>
					)}
				</MapView>
			)}
		</SafeAreaView>
	);
}