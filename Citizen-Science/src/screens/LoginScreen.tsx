import React from 'react';
import { ImageBackground, SafeAreaView, Text } from "react-native";
import styles from '../StyleSheet';

const LoginScreen: React.FC = () => {
    return(
        <ImageBackground
            source={require('../../assets/background.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}>

            {/* Logo Name */}
            <SafeAreaView style={{ flex: 1 }}>
                <Text style={styles.title}>WOOPE</Text>
            </SafeAreaView>

            {/* Login title */}
            <SafeAreaView style={{ flex: 1 }}>
                <Text style={styles.subTitle}>Login</Text>
            </SafeAreaView>

        </ImageBackground>
    )
};

export default LoginScreen;
