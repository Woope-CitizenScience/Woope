import React from 'react';
import {SafeAreaView, Text} from "react-native";
import BackButton from "../components/BackButton";
import LogoName from "../components/LogoName";

const SignupScreen = () => {
    return(
        <SafeAreaView style={{ flex:1 }}>
            <Text>Signup Screen!</Text>
            <BackButton />
            <LogoName position={'bottomRight'} color={'grey'}/>
        </SafeAreaView>
    )
};
export default SignupScreen;