import React from 'react';
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import Icon from 'react-native-vector-icons/MaterialIcons';
const BackButton = () => {
    const navigation = useNavigation();
    return (
        <View style={{ top: responsiveHeight(-45), left: responsiveWidth(-45) }}>
            <Icon
                name="arrow-back"
                size={responsiveWidth(7)}
                color="white"
                onPress={() => navigation.goBack()} />
        </View>
    );
}
export default BackButton;