import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, Text, TouchableOpacity, Dimensions} from "react-native";
import styles from '../StyleSheet';
import CustomButton from '../components/CustomButton';
import CustomTextField from '../components/CustomTextField';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoName from "../components/LogoName";
import BackButton from "../components/BackButton";
import ScreenTitle from "../components/ScreenTitle";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";

type NavigationParam = {
    Login: undefined;
    Signup: undefined;
    NavigationBar: undefined;
};

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { height, width } = Dimensions.get('window')



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // handleLoginPress:
    // Here we need to define what will happen when the login button us pressed. So user authentication.
    const handleLoginPress = () => {
        console.log('Login button pressed');
        // logic for what should happen on login press
        navigation.navigate('NavigationBar');
    };

    // @ts-ignore
    return (

        <ImageBackground
            source={require('../../assets/background1.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}>

            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <BackButton />

                {/* Logo Name */}
                <LogoName position={'bottomRight'} color={'grey'}/>


                {/* Login title, fields and login button */}
                <ScreenTitle
                    text={'Login'}
                    textStyle={'title'}
                    // TODO font size with be determined with PixelRatio lib
                    fontSize={5}
                    color={'white'}
                    position={{top: 25, left: 5}}
                />


                {/* Email TextField */}
                <CustomTextField
                    size={{ width: width * 0.70, height: height * 0.05 }}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    borderColor="#5EA1E9"
                    borderRadius={10}
                    position={{ horizontal: 'center', vertical: height * 0.61 }}
                />


                {/* Password TextField */}
                <CustomTextField
                    size={{ width: width * 0.70, height: height * 0.05 }}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true} // To hide password input
                    borderColor="#5EA1E9"
                    borderRadius={10}
                    position={{ horizontal: 'center', vertical: height * 0.68 }}
                />

                <CustomButton
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    label="Login"
                    labelColor="white"
                    backgroundColor="#5EA1E9"
                    //TODO potentially redirect to home page after account creation
                    onPress={() => handleLoginPress()}
                    //TODO potentially implement react responsive library
                    position={{ horizontal: 'center', vertical: height * 0.75 }}
                />

                <Text style={{fontSize: width * 0.04, position: 'absolute', top: height * 0.85}}>
                    Don't have an account?{' '}
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={{fontSize: width * 0.04,  color: '#1e90ff', textDecorationLine: 'underline' }}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </Text>

            </SafeAreaView>

        </ImageBackground>
    );
};

export default LoginScreen;