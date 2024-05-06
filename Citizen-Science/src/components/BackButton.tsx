import React from 'react';
import {TouchableOpacity, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackButtonProps } from "../types";

const BackButton: React.FC<BackButtonProps> = ({
    position,
}) => {
    const navigation = useNavigation();

    const backButtonStyle: ViewStyle = {
        top: responsiveHeight(position.top),
        left: responsiveWidth(position.left),
    };

    return (
        <TouchableOpacity style={backButtonStyle} onPress={() => navigation.goBack()}>
            <Icon
                name="arrow-back"
                size={responsiveWidth(7)}
                color="white" />
        </TouchableOpacity>
    );
};

export default BackButton;