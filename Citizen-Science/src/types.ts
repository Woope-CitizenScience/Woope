// Props for Custom Button creation
export type ButtonProps = {
    size: { width: number; height: number };
    label: string;
    labelColor: string;
    backgroundColor?: string;
    onPress: () => void;
    position: { horizontal: number | string; vertical: number | string};
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
    position: { horizontal: number; vertical: number };
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
    width: number;
    height: number;
    position: { horizontal: number | string; vertical: number | string } ;

};

export type TitleProps = {
    text: string;
    fontSize: number;
    textStyle: 'title' | 'subtitle';
    color: string;
    position: { horizontal: number, vertical: number };
};
