import React from 'react';
import {Button, SafeAreaView, Text, View, StyleSheet, Dimensions} from "react-native";
import styles from "../StyleSheet";
import LogoName from "../components/LogoName";
import CustomButton from "../components/CustomButton";
import Blobs from "../components/Blobs";
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import ScreenTitle from "../components/ScreenTitle";

type NavigationParam = {
    Welcome: undefined;
    Signup: undefined;
    Login: undefined;
};

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Welcome'>;
const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { height, width } = Dimensions.get('window')

    return(
        <View style={styles.backgroundColor}>


            {/* Logo Name */}
            <LogoName position={'topLeft'} color={'white'} />

            {/* Top Right Corner Blob */}
            <Blobs
                rotationDeg={'40deg'}
                // TODO width and height has to be scaled with dimensions
                width={480}
                height={480}
                image={require('../../assets/blobs/corner_blobs/Corner_Blob_2.png')}
                position={{horizontal: width * -0.40, vertical: height * 0.73}} />

            {/* First blob cluster */}
            <Blobs width={100} height={100} position={{ horizontal: width * 0.75, vertical: height * 0.05 }} />
            <Blobs width={50} height={50} position={{ horizontal: width * 0.85, vertical: height * 0.18 }} />
            <Blobs width={35} height={35} position={{ horizontal: width * 0.70, vertical: height * 0.01 }} />

            {/* Second blob cluster */}
            <Blobs width={90} height={90} position={{ horizontal: width * 0.80, vertical: height * 0.45 }} />
            <Blobs width={25} height={25} position={{ horizontal: width * 0.90, vertical: height * 0.42 }} />

            {/* Third blob cluster */}
            <Blobs width={110} height={110} position={{ horizontal: width * 0.75, vertical: height * 0.86 }} />
            <Blobs width={40} height={40} position={{ horizontal: width * 0.88, vertical: height * 0.83 }} />
            <Blobs width={45} height={45} position={{ horizontal: width * 0.60, vertical: height * 0.94 }} />

            {/* Welcome title */}
            <ScreenTitle
                text={'Welcome'}
                textStyle={'title'}
                // TODO font size with be determined with PixelRatio lib
                fontSize={45}
                color={'white'}
                position={{horizontal: width * 0.08, vertical: height * 0.40}}
            />

            {/* Welcome subtitle */}
            <ScreenTitle
                text={'(taŋyáŋ yah)'}
                textStyle={'subtitle'}
                // TODO font size with be determined with PixelRatio lib
                fontSize={25}
                color={'white'}
                position={{horizontal: width * 0.08, vertical: height * 0.46}}
            />

            {/* Login Button */}
            <CustomButton
                //TODO size will be scaled based on dimension
                size={{width: 300, height: 70}}
                label={'Login'}
                labelColor={'#3a9bdc'}
                backgroundColor={'white'}
                onPress={() => navigation.navigate('Login')}
                position={{ horizontal: 'center', vertical: height * 0.65 }}
                borderRadius={10}
                borderColor={'white'}
                borderWidth={3}
            />

            {/* Signup Button */}
            <CustomButton
                //TODO size will be scaled based on dimension
                size={{width: 300, height: 70}}
                label={'Signup'}
                labelColor={'white'}
                backgroundColor={'#3a9bdc'}
                onPress={() => navigation.navigate('Signup')}
                position={{ horizontal: 'center', vertical: height * 0.75 }}
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