import React from 'react';
import CustomButton from "./CustomButton";
import {Button, View} from "react-native";
import navigation from "../Navigation";
import {useNavigation} from "@react-navigation/native";



// @ts-ignore
const BackButton = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Button
                title={'Go Back'}
                onPress={() => navigation.goBack()}
                color={'black'}
            />
        </View>

        )
}

export default BackButton;