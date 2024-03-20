import React, { useEffect } from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import { useNavigation, NavigationContainerRef, CommonActions } from '@react-navigation/native';


// Get full width and height of the device's screen
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function SplashScreen() {
    const navigation = useNavigation<NavigationContainerRef<any>>();

    useEffect(() => {

        // Splash screen for 2 seconds
        const splashTimer = setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                })
            );
        }, 2000);

        return () => clearTimeout(splashTimer); // This will cancel our splash screen after 2 seconds
    }, []);

    const image = require('../../assets/splashh.png');
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={image}
                style={{ width: screenWidth, height: screenHeight }}
            />
        </View>
    );
}

export default SplashScreen;