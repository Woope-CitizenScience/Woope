import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
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

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/arcs.png')} style={styles.topImage} />
            <View style={styles.row}>
                <Image source={require('../../assets/nasa.png')} style={styles.rowImage} />
                <Image source={require('../../assets/sbc.png')} style={styles.rowImage} />
                <Image source={require('../../assets/wozu.png')} style={styles.rowImage} />
            </View>
            <View style={styles.row}>
                <Image source={require('../../assets/JPL.png')} style={styles.bottomRowImage} />
            </View>
            <View style={styles.row}>
                <Image source={require('../../assets/csun.png')} style={styles.bottomRowImage} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topImage: {
        width: 330,
        height: 190,
        marginTop: 3,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 60,
    },
    rowImage: {
        width: 100,
        height: 100,
    },
    bottomRowImage: {
        width: 700 * scaleFactor,
        height: 113 * scaleFactor,
        resizeMode: 'contain',
    }
});

export default SplashScreen;
