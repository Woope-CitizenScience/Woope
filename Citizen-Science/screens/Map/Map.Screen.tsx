import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet , SafeAreaView, Dimensions} from 'react-native';
import MapView, { Marker } from "react-native-maps";
import {FAB, Title} from 'react-native-paper';
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import { mapStyle } from './Map.Style';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;



export const MapScreen = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
  };

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
                <MapView style={mapStyle.map} initialRegion={initialRegion} onPress={handleMapPress}
                >
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
                  {markerCoordinate && (                                        //user defined soft pin to be uploaded to future DB
                      <Marker                                                   //for saving/sharing
                      pinColor='aqua'
                      coordinate={markerCoordinate}
                      title="Dynamic Marker"
                      description="This marker updates on press"
                     />
                  )}
                </MapView>
              )}
              </View>
              );
}