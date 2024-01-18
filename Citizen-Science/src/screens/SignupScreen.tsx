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
import homeScreen from "./HomeScreen";
import loginScreen from "./LoginScreen";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import Blobs from "../components/Blobs";

type NavigationParam = {
    Login: undefined;
    Signup: undefined;
    NavigationBar: undefined;
};

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Signup'>;

const SignupScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        <ImageBackground
            source={require('../../assets/background2.png')}
            style={{ flex: 1 }}>


            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                {/* First Blob Cluster */}
                <Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 45, left: 6 }} />
                <Blobs rotationDeg={'0deg'} widthPercentage={10} heightPercentage={5} position={{ top: 45, left: 30 }} />

                {/* Second Blob Cluster */}
                <Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 6, left: 80 }} />
                <Blobs rotationDeg={'0deg'} widthPercentage={6} heightPercentage={3} position={{ top: 15, left: 93 }} />

                {/* Logo name */}
                <LogoName position={'bottomRight'} color={'grey'}/>

                {/* Back Button */}
                <BackButton />

                {/* 'Create an Account' title on signup */}
                <ScreenTitle
                    text={'Create an \nAccount'}
                    textStyle={'title'}
                    fontSize={5}
                    color={'white'}
                    // Uses responsive library {width, height} through the components file
                    position={{top: 20 , left: 5}}
                />

                {/* Name TextField */}
                <CustomTextField
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    placeholder="Name"
                    value={email}
                    onChangeText={setName}
                    borderColor="#5EA1E9"
                    borderRadius={10}
                    position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(60) }}
                />

                {/* Email TextField */}
                <CustomTextField
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    // TODO: Add option to signup with phone number
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    borderColor="#5EA1E9"
                    borderRadius={10}
                    position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(69) }}
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
                    position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(78) }}
                />

                {/* Signup Button */}
                <CustomButton
                    size={{width: responsiveWidth(70), height: responsiveHeight(5.5)}}
                    label="Sign Up"
                    labelColor="white"
                    backgroundColor="#5EA1E9"
                    //TODO potentially redirect to home page after account creation
                    onPress={() => navigation.navigate('Login')}
                    position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(86) }}
                />

            </SafeAreaView>

        </ImageBackground>


    )
};
export default SignupScreen;