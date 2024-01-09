// Props for Custom Button creation
import {DimensionValue} from "react-native";

export type ButtonProps = {
    size: { width: number; height: number };
    label: string;
    labelColor: string;
    backgroundColor?: string;
    onPress: () => void;
    position: { horizontal: DimensionValue | undefined ; vertical: DimensionValue | undefined};
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    disabled?: boolean;
    // Other styling properties as needed
};

//Props for Custom TextField Creation
export type TextFieldProps = {
    size: { width: number; height: number };
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    borderColor?: string;
    borderRadius?: number;
    position: { horizontal: number | string; vertical: number | string};
    // Other properties as needed, like keyboardType, returnKeyType, etc.
};

export type LogoNameProps = {
    position: 'topLeft' | 'bottomRight' ;
    color: string;
};

export type BlobProps = {
    // Rotation is not required because it is randomized in the Blob component
    rotationDeg?: string; // Format: '45deg'
    image?: string;
    widthPercentage: number;
    heightPercentage: number;
    position: { top: number; left: number} ;

};

export type TitleProps = {
    text: string;
    fontSize: number;
    textStyle: 'title' | 'subtitle';
    color: string;
    position: { top: number; left: number};
};
