import React from 'react';
import {Button, SafeAreaView, Text, View, StyleSheet, Dimensions} from "react-native";
import styles from "../StyleSheet";
import LogoName from "../components/LogoName";
import CustomButton from "../components/CustomButton";
import Blobs from "../components/Blobs";
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import ScreenTitle from "../components/ScreenTitle";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";

type NavigationParam = {
    Welcome: undefined;
    Signup: undefined;
    Login: undefined;
};

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Welcome'>;
const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return(
        <View style={styles.backgroundColor}>


            {/* Logo Name */}
            <LogoName position={'topLeft'} color={'white'} />

            {/* Top Right Corner Blob */}
            <Blobs
                rotationDeg={'45deg'}
                widthPercentage={80}
                heightPercentage={25}
                image={require('../../assets/blobs/corner_blobs/Corner_Blob_2.png')}
                position={{top: 85, left: -22}} />

            {/* First blob cluster */}
            <Blobs rotationDeg={'0deg'} widthPercentage={24} heightPercentage={12} position={{ top: 1, left: 75}} />
            <Blobs rotationDeg={'0deg'} widthPercentage={10} heightPercentage={5} position={{ top: 20, left: 88 }} />
            <Blobs rotationDeg={'0deg'} widthPercentage={10} heightPercentage={5} position={{ top: 1, left: 64 }} />

            {/* Second blob cluster */}
            <Blobs rotationDeg={'0deg'} widthPercentage={8} heightPercentage={4} position={{ top: 45, left: 90 }} />
            <Blobs rotationDeg={'0deg'} widthPercentage={16} heightPercentage={9} position={{ top: 50, left: 80 }} />

            {/* Third blob cluster */}
            <Blobs rotationDeg={'0deg'} widthPercentage={8} heightPercentage={4} position={{ top: 84, left: 91 }} />
            <Blobs rotationDeg={'0deg'} widthPercentage={18} heightPercentage={9} position={{ top: 89, left: 81 }} />
            <Blobs rotationDeg={'0deg'} widthPercentage={5} heightPercentage={3} position={{ top: 97, left: 78 }} />

            {/* 'Welcome' title */}
            <ScreenTitle
                text={'Welcome'}
                textStyle={'title'}
                fontSize={4}
                color={'white'}
                // Uses responsive library {width, height} through the components file
                position={{top: 35, left: 8}}
            />

            {/* 'Welcome' subtitle in Lakota language */}
            <ScreenTitle
                text={'(taŋyáŋ yah)'}
                textStyle={'subtitle'}
                fontSize={2}
                color={'white'}
                // Uses responsive library {width, height} through the components file
                position={{top: 42.5, left: 10}}
            />

            {/* Login Button */}
            <CustomButton
                size={{width: responsiveWidth(70), height: responsiveHeight(8)}}
                label={'Login'}
                labelColor={'#3a9bdc'}
                backgroundColor={'white'}
                onPress={() => navigation.navigate('Login')}
                position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(65) }}
                borderRadius={10}
                borderColor={'white'}
                borderWidth={3}
            />

            {/* Signup Button */}
            <CustomButton
                size={{width: responsiveWidth(70), height: responsiveHeight(8)}}
                label={'Signup'}
                labelColor={'white'}
                backgroundColor={'#5EA1E9'}
                onPress={() => navigation.navigate('Signup')}
                position={{ horizontal: responsiveWidth(15), vertical: responsiveHeight(75) }}
                borderRadius={10}
                borderColor={'white'}
                borderWidth={3}
            />
        </View>
    )
};
export default WelcomeScreen;

const welcomeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
      position: 'absolute',
      width: '100%'
    },

});