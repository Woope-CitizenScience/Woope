import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native'
import { FrontPageScreen } from '../screens/FrontPage/FrontPage.Screen';
import {SafeAreaView} from 'react-native';
import { HomeScreen } from './MapHome/MapHome.Screen';
import { MapScreen } from '../screens/Map/Map.Screen';


export const MappNavigator = () => {
    const {Navigator, Screen} = createNativeStackNavigator();
    return(
    <NavigationContainer>
        <Navigator  initialRouteName='FrontPage'>
            <Screen name = "FrontPageScreen" component = {FrontPageScreen}></Screen>
            <Screen name = "HomeScreen" component = {HomeScreen}></Screen>
            <Screen name = "MapScreen" component = {MapScreen}></Screen>
        </Navigator>
    </NavigationContainer>
    );
}