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
                  <Marker 
                  coordinate={{latitude: 34.239958, longitude: -118.529187}}
                  title="CSUN Library"
                  />
                </MapView>
              )}
              </View>
              );
}