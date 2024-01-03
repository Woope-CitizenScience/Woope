import React from 'react';
import CustomButton from "./CustomButton";
import {Button} from "react-native";
import navigation from "../Navigation";
import {useNavigation} from "@react-navigation/native";



// @ts-ignore
const BackButton = () => {
    const navigation = useNavigation();
    return (
       <Button
           title={'<'}
           onPress={() => navigation.goBack()}
           color={'black'}
           />
        )
}

export default BackButton;