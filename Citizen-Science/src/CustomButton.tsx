// CustomButton.tsx

import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { ButtonProps } from './types';
import styles from './StyleSheet'; // Adjust the import path as necessary

const CustomButton: React.FC<ButtonProps> = ({
    size,
    label,
    labelColor,
    backgroundColor = 'blue',
    onPress,
    position,
    borderRadius = 10, //default value. Like that all buttons look the same
    disabled = false
}) => {
    const buttonStyle: ViewStyle = {
        ...styles.button,
        width: size.width,
        height: size.height,
        backgroundColor,
        borderRadius,
        position: 'absolute',
        left: position.horizontal,
        top: position.vertical,
        opacity: disabled ? 0.5 : 1
    };

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled}>
            <Text style={[styles.buttonText, { color: labelColor }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default CustomButton;