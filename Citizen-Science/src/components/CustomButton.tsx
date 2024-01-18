// CustomButton.tsx

import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { ButtonProps } from '../types';
import styles from '../StyleSheet';

const CustomButton: React.FC<ButtonProps> = ({
    size,
    label,
    labelColor,
    backgroundColor = 'blue',
    onPress,
    position,
    borderRadius = 10, //default value. Like that all buttons look the same
    borderColor,
    borderWidth,
    }) => {
    const buttonStyle: ViewStyle = {
        ...styles.button,
        width: size.width,
        height: size.height,
        backgroundColor,
        borderRadius,
        borderColor,
        borderWidth,
        position: 'absolute',
        left: position.horizontal,
        top: position.vertical,
    };

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress} >
            <Text style={[styles.buttonText, { color: labelColor }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default CustomButton;