import React from 'react';
import  { Text, StyleSheet, View } from 'react-native';
import { TitleProps } from "../types";
import styleSheet from "../StyleSheet";

const ScreenTitle: React.FC<TitleProps>= ({
                                              text,
                                              fontSize,
                                              textStyle,
                                              color,
                                              position
                                          }) => {

    const style = {
        fontSize: fontSize,
        color: color,
        left: position.horizontal,
        top: position.vertical,
    };

    return (
        <View style={[style, {position: 'absolute'}]}>
            {
                textStyle === 'title'
                    ? <Text style={[styleSheet.title, { fontSize: style.fontSize, color: style.color }]}>{text}</Text>
                    : <Text style={[styleSheet.subtitle, { fontSize: style.fontSize, color: style.color }]}>{text}</Text>

            }
        </View>
    );
};



export default ScreenTitle;
