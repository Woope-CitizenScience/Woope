// LoginScreen.tsx

import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, Text, TouchableOpacity } from "react-native";
import styles from '../StyleSheet';
import CustomButton from '../CustomButton'; // Adjust the path to where your CustomButton is located
import CustomTextField from '../CustomTextField'; // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native';


const LoginScreen: React.FC = () => {
    const navigation = useNavigation();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // handleLoginPress:
    // Here we need to define what will happen when the log in button us pressed. So user authentication.
    const handleLoginPress = () => {
        console.log('Login button pressed');
        // logic for what should happen on login press
    };

    // @ts-ignore
    return (
        <ImageBackground
            source={require('../../assets/background.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}>

            {/* Logo Name */}
            <SafeAreaView style={{ flex: 1 }}>
                <Text style={styles.title}>WOOPE</Text>
            </SafeAreaView>

            {/* Login title, fields and login button */}
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.subTitle}>Login</Text>

                {/* Email TextField */}
                <CustomTextField
                    size={{ width: 300, height: 50 }}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    borderColor="#1e90ff"
                    borderRadius={10}
                    position={{ horizontal: 50, vertical: 50 }}
                />

                {/* Password TextField */}
                <CustomTextField
                    size={{ width: 300, height: 50 }}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true} // To hide password input
                    borderColor="#1e90ff"
                    borderRadius={10}
                    position={{ horizontal: 50, vertical: 110 }}
                />

                <CustomButton
                    size={{ width: 300, height: 50 }}
                    label="Login"
                    labelColor="white"
                    backgroundColor="#1e90ff"
                    onPress={handleLoginPress}
                    position={{ horizontal: 50, vertical: 170 }}
                />
            </SafeAreaView>

            {/* Don't have an account? Sign Up */}
            <SafeAreaView style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{position: 'absolute', top: -165}}>
                    Don't have an account?{' '}
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={{ color: '#1e90ff', textDecorationLine: 'underline' }}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </Text>
            </SafeAreaView>

        </ImageBackground>
    );
};

export default LoginScreen;