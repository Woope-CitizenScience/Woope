import React, {useContext, useState} from 'react';
import {ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity} from "react-native";
import CustomButton from '../components/CustomButton';
import CustomTextField from '../components/CustomTextField';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoName from "../components/LogoName";
import BackButton from "../components/BackButton";
import ScreenTitle from "../components/ScreenTitle";

import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import Blobs from "../components/Blobs";
import {loginUser} from "../api/auth";
//import {storeToken} from "../util/token"
import { AuthContext } from "../util/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';


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
	const { setUserToken } = useContext(AuthContext);
    const handleLoginPress = async () => {
        try {
            const response = await loginUser(email, password);
            setUserToken(response.accessToken); // Use the token directly
        } catch (error) {
            console.log('Login failed', error);
        }
    };
    

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>

        <ImageBackground
            source={require('../../assets/background1.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}>




            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                {/* First Blob Cluster */}
                {/*<Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 45, left: 75 }} />*/}
                {/*<Blobs rotationDeg={'0deg'} widthPercentage={10} heightPercentage={5} position={{ top: 45, left: 60 }} />*/}

                {/* Second Blob Cluster */}
                <Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 6, left: 80 }} />
                <Blobs rotationDeg={'0deg'} widthPercentage={6} heightPercentage={3} position={{ top: 15, left: 93 }} />


                <LogoName position={'bottomRight'} color={'grey'}/>


                <BackButton position={{ top: -30, left: -45 }} />


                {/*  'Welcome Back' title on login */}
                <ScreenTitle
                    text={'Welcome \nBack'}
                    textStyle={'title'}
                    fontSize={5}
                    color={'white'}
                    position={{top: -17, left: -20}}
                />



                {/* Email TextField */}
                <CustomTextField
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    borderColor="#5EA1E9"
                    borderRadius={10}
                    position={{ top: 8, left: 0 }}
                    textContentType={'oneTimeCode'}
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
                    position={{ top: 10, left: 0 }}
                    textContentType={'oneTimeCode'}
                />

                {/* Login Button */}
                <CustomButton
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    label="Login"
                    labelColor="white"
                    backgroundColor="#5EA1E9"
                    //TODO: potentially redirect to home page after account creation
                    onPress={() => handleLoginPress()}
                    position={{ top: 12, left: 0 }}
                />

                {/* Giving Users the option to signup if they are not registered */}
                <Text style={{fontSize: responsiveFontSize(2), position: 'absolute', top: responsiveHeight(84)}}>
                    Don't have an account?{' '}
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={{fontSize: responsiveFontSize(2),  color: '#5EA1E9', top: responsiveHeight(0.4) }}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </Text>

            </SafeAreaView>


        </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;