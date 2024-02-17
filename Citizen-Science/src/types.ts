// Props for Custom Button creation
export type ButtonProps = {
    size: { width: number; height: number };
    label: string;
    labelColor: string;
    backgroundColor?: string;
    onPress: () => void;
    position: { top: number; left: number};
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    disabled?: boolean;

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
    position: { top: number; left: number};
    textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' | 'password' | 'newPassword' | 'oneTimeCode';
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



export type IconButtonProps = {
    iconName: string;
	onPress: () => void;
	iconSize: number,
	iconColor: string,
    borderWidth?: number;
    borderRadius?: number;
    borderColor?: string;
    height?: number,
    width?: number,
    backgroundColor?: string,
    paddingHorizontal?: number,
    paddingBottom?: number,
    paddingTop?: number,
    paddingLeft?: number,
	paddingRight?: number,
    paddingVertical?: number,
};

export type BackButtonProps = {
    position: {top: number; left: number};
}