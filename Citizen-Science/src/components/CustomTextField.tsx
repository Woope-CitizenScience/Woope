// CustomTextField.tsx

import React from 'react';
import { TextInput, ViewStyle, StyleSheet } from 'react-native';
import { TextFieldProps } from '../types';
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";

const CustomTextField: React.FC<TextFieldProps> = ({
   size,
   placeholder,
   value,
   onChangeText,
   secureTextEntry = false,
   borderColor = '#000', // Default color
   borderRadius = 5,
   position,
   }) => {
    const textFieldStyle: ViewStyle = {
        width: size.width,
        height: size.height,
        borderColor,
        borderRadius,
        borderWidth: 1,
        paddingHorizontal: 10, // Padding inside the text field
        top: responsiveHeight(position.top),
        left: responsiveWidth(position.left),

    };

    return (
        <TextInput
            style={textFieldStyle}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            // Include other TextInput properties here
        />
    );
};

export default CustomTextField;