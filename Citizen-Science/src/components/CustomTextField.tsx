// CustomTextField.tsx

import React from 'react';
import { TextInput, TextInputProps, ViewStyle } from 'react-native';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

interface CustomTextFieldProps extends TextInputProps {
    size: { width: number; height: number };
    borderColor?: string;
    borderRadius?: number;
    position: { top: number; left: number };
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
    size,
    borderColor = '#000',
    borderRadius = 5,
    position,
    style,
    ...rest
}) => {
    const textFieldStyle: ViewStyle = {
        width: size.width,
        height: size.height,
        borderColor,
        borderRadius,
        borderWidth: 1,
        paddingHorizontal: 10,
        top: responsiveHeight(position.top),
        left: responsiveWidth(position.left),
    };

    return (
        <TextInput
            style={[textFieldStyle, style]}
            {...rest}
        />
    );
};
export default CustomTextField;