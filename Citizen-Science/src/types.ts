// Props for Custom Button creation
export type ButtonProps = {
    size: { width: number; height: number };
    label: string;
    labelColor: string;
    backgroundColor?: string;
    onPress: () => void;
    position: { horizontal: number; vertical: number };
    borderRadius?: number;
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