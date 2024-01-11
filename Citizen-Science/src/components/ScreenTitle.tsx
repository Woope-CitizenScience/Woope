import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TitleProps } from "../types";
import styleSheet from "../StyleSheet";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const ScreenTitle: React.FC<TitleProps> = ({
    text,
    fontSize,
    textStyle,
    color,
    position
}) => {

    const textAppearanceStyle = StyleSheet.create({
        text: {
            fontSize: responsiveFontSize(fontSize),
            color: color,
        },
    });

    const positionStyle = StyleSheet.create({
        container: {
            position: 'absolute',
            top: responsiveHeight(position.top),
            left: responsiveWidth(position.left),
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <View style={positionStyle.container}>
            {
                textStyle === 'title'
                    ? <Text style={[styleSheet.title, textAppearanceStyle.text]}>{text}</Text>
                    : <Text style={[styleSheet.subtitle, textAppearanceStyle.text]}>{text}</Text>
            }
        </View>
    );
};

export default ScreenTitle;
