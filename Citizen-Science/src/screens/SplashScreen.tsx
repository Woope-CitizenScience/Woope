import React, { useEffect } from 'react';
import {View, Image, StyleSheet, ImageBackground} from 'react-native';
import { useNavigation, NavigationContainerRef } from '@react-navigation/native';

const scaleFactor = 0.5;
function SplashScreen() {
    const navigation = useNavigation<NavigationContainerRef<any>>();

    useEffect(() => {
        // Splash screen for 2 seconds
        const splashTimer = setTimeout(() => {
            navigation.navigate('Welcome'); // This will take us to welcome screen
        }, 2000);

        return () => clearTimeout(splashTimer); // This will cancel our splash screen after 2 seconds
    }, []);

    const image = require('../../assets/SplashScreen.png')
    return (
        <View style={{ flex: 1 }}>
            <Image
                source={image}
                style={{ width: '100%', height: '100%', justifyContent: 'center', resizeMode: 'cover'}}
            >
            </Image>
        </View>

    );
}
export default SplashScreen;
