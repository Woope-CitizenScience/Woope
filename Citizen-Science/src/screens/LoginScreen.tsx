import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, Text, TouchableOpacity} from "react-native";
import CustomButton from '../components/CustomButton';
import CustomTextField from '../components/CustomTextField';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoName from "../components/LogoName";
import BackButton from "../components/BackButton";
import ScreenTitle from "../components/ScreenTitle";

import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import Blobs from "../components/Blobs";


type NavigationParam = {
    Login: undefined;
    Signup: undefined;
    NavigationBar: undefined;
};

type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // handleLoginPress:
    // Here we need to define what will happen when the login button is pressed. So user authentication.
    const handleLoginPress = () => {
        console.log('Login button pressed');
        // logic for what should happen on login press
        navigation.navigate('NavigationBar');
    };

    return (

        <ImageBackground
            source={require('../../assets/background1.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}>


            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                {/* First Blob Cluster */}
                <Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 45, left: 75 }} />
                <Blobs rotationDeg={'0deg'} widthPercentage={10} heightPercentage={5} position={{ top: 45, left: 60 }} />

                {/* Second Blob Cluster */}
                <Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 6, left: 80 }} />
                <Blobs rotationDeg={'0deg'} widthPercentage={6} heightPercentage={3} position={{ top: 15, left: 93 }} />

                {/* Logo Name */}
                <LogoName position={'bottomRight'} color={'grey'}/>

                {/* Back Button */}
                <BackButton />

                {/*  'Welome Back' title on login */}
                <ScreenTitle
                    text={'Welcome \nBack'}
                    textStyle={'title'}
                    fontSize={5}
                    color={'white'}
                    // Uses responsive library {width, height} through the components file
                    position={{top: 20, left: 5}}
                />


                {/* Email TextField */}
                <CustomTextField
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    borderColor="#5EA1E9"
                    borderRadius={10}
                    position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(61) }}
                />


                {/* Password TextField */}
                <CustomTextField
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true} // To hide password input
                    borderColor="#5EA1E9"
                    borderRadius={10}
                    position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(68) }}
                />

                {/* Login Button */}
                <CustomButton
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    label="Login"
                    labelColor="white"
                    backgroundColor="#5EA1E9"
                    //TODO: potentially redirect to home page after account creation
                    onPress={() => handleLoginPress()}
                    position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(75) }}
                />

                {/* Giving Users the option to signup if they are not registered */}
                <Text style={{fontSize: responsiveFontSize(2), position: 'absolute', top: responsiveHeight(84)}}>
                    Don't have an account?{' '}
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={{fontSize: responsiveFontSize(2),  color: '#5EA1E9', textDecorationLine: 'underline' }}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </Text>

            </SafeAreaView>

        </ImageBackground>
    );
};

export default LoginScreen;