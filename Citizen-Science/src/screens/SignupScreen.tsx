import React, { useContext, useState } from 'react';
import { ImageBackground, SafeAreaView, Platform, KeyboardAvoidingView, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import CustomTextField from '../components/CustomTextField';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LogoName from "../components/LogoName";
import BackButton from "../components/BackButton";
import ScreenTitle from "../components/ScreenTitle";
import Popup from "../components/Popup";
import { registerUser } from "../api/auth";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import Blobs from "../components/Blobs";
import { storeToken } from "../util/token";
import { AuthContext } from "../util/AuthContext";

type NavigationParam = {
	Login: undefined;
	Signup: undefined;
	NavigationBar: undefined;
};

interface Errors {
	email?: string;
	firstName?: string;
	lastName?: string;
	password?: string;
	dateOfBirth?: string;
}

interface UserInfo {
	firstName: string;
	lastName: string;
	email: string;
	dateOfBirth: string;
	password: string;
}

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Signup'>;

const SignupScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const [userInfo, setUserInfo] = useState<UserInfo>({
		firstName: '',
		lastName: '',
		dateOfBirth: '',
		email: '',
		password: ''
	});

	const [showPassword, setShowPassword] = useState(false);

	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');

	const showPopup = (messages: string[]) => {
		const formattedMessages = messages.map(message => `\u2022 ${message}`).join('\n');
		setPopupMessage(formattedMessages);
		setIsPopupVisible(true);
	};




	const [errors, setErrors] = useState<Errors>({});
	const { setUserToken } = useContext(AuthContext);

	const handleInputChange = (field: keyof UserInfo, value: string) => {
		setUserInfo(prevState => ({ ...prevState, [field]: value }));
	};

	const handleSignUpPress = async () => {
		if (validate()) {
			try {
				const response = await registerUser(userInfo.email, userInfo.password, userInfo.firstName, userInfo.lastName, userInfo.dateOfBirth);

				await storeToken('accessToken', response.accessToken);
				await storeToken('refreshToken', response.refreshToken);

				setUserToken(response.accessToken);
			} catch (error) {
				console.log('Signup failed', error);
			}
		}
	};
	const validate = (): boolean => {
		let newErrors: Errors = {};
		let isValid = true;
		let errorMessages: string[] = [];

		const emailRegex = /^[^\s@]+@(gmail\.com|icloud\.com|hotmail\.com|yahoo\.com)$/;
		if (!emailRegex.test(userInfo.email.trim())) {
			newErrors.email = 'Invalid email';
			isValid = false;
			errorMessages.push('Invalid email');
		}

		//Checks that password has at least one UpperCase, a number, and 8 or more characters.
		const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
		if (!passwordRegex.test(userInfo.password)) {
			newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
			isValid = false;
			errorMessages.push('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
		}

		if (userInfo.firstName.trim().length === 0) {
			newErrors.firstName = 'First name is required';
			isValid = false;
			errorMessages.push('First name is required');
		}

		if (userInfo.lastName.trim().length === 0) {
			newErrors.lastName = 'Last name is required';
			isValid = false;
			errorMessages.push('Last name is required');
		}

		const dateOfBirthRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d\d$/;
		if (!dateOfBirthRegex.test(userInfo.dateOfBirth.trim())) {
			newErrors.dateOfBirth = 'Invalid date format';
			isValid = false;
			errorMessages.push('Invalid date format');
		}


		setErrors(newErrors);

		if (!isValid) {
			showPopup(errorMessages);
		}

		return isValid;
	};





	return (

		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}>

			<ImageBackground
				source={require('../../assets/background2.png')}
				style={{ flex: 1 }}>


				<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

					{/* First Blob Cluster */}
					{/*<Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 45, left: 6 }} />*/}
					{/*<Blobs rotationDeg={'0deg'} widthPercentage={10} heightPercentage={5} position={{ top: 45, left: 30 }} />*/}

					{/* Second Blob Cluster */}
					<Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 6, left: 80 }} />
					<Blobs rotationDeg={'0deg'} widthPercentage={6} heightPercentage={3} position={{ top: 15, left: 93 }} />


					<LogoName position={'bottomRight'} color={'grey'} />


					<BackButton position={{ top: -22, left: -45 }} />


					{/* 'Create an Account' title on signup */}
					<ScreenTitle
						text={'Create an \nAccount'}
						textStyle={'title'}
						fontSize={5}
						color={'white'}
						// Uses responsive library {width, height} through the components file
						position={{ top: -10, left: -20 }}
					/>

					<CustomTextField
						size={{ width: responsiveWidth(23.5), height: responsiveHeight(5.5) }}
						placeholder="First Name"
						value={userInfo.firstName}
						onChangeText={(value) => handleInputChange('firstName', value)}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top: 20, left: -23 }}
					/>

					<CustomTextField
						size={{ width: responsiveWidth(23.1), height: responsiveHeight(5.5) }}
						placeholder="Last Name"
						value={userInfo.lastName}
						onChangeText={(value) => handleInputChange('lastName', value)}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top: 14.5, left: 2 }}
					/>

					<CustomTextField
						size={{ width: responsiveWidth(19.5), height: responsiveHeight(5.5) }}
						placeholder="11/14/93"
						value={userInfo.dateOfBirth}
						onChangeText={(value) => handleInputChange('dateOfBirth', value)}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top: 9, left: 25 }}
					/>

					<CustomTextField
						size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
						// TODO: Add option to signup with phone number
						placeholder="Email"
						value={userInfo.email}
						onChangeText={(value) => handleInputChange('email', value)}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top: 10, left: 0 }}
						textContentType={'oneTimeCode'}
					/>
					{/* Password TextField with show/hide */}
					<View style={{ position: 'relative' }}>
						<CustomTextField
							size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
							placeholder="Password"
							value={userInfo.password}
							onChangeText={(value) => handleInputChange('password', value)}
							secureTextEntry={!showPassword}
							borderColor="#5EA1E9"
							borderRadius={10}
							position={{ top: 11, left: 0 }}
							textContentType={'oneTimeCode'}
						/>
						<TouchableOpacity
							onPress={() => setShowPassword(!showPassword)}
							style={{
								position: 'absolute',
								left: 280,
								top: responsiveHeight(11),
								height: responsiveHeight(5.5),
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Ionicons
								name={showPassword ? 'eye-off' : 'eye'}
								size={20}
								color="#5EA1E9"
							/>
						</TouchableOpacity>
					</View>
					{/* Signup Button */}
					<CustomButton
						size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
						label="Sign Up"
						labelColor="white"
						backgroundColor="#5EA1E9"
						//TODO potentially redirect to home page after account creation
						onPress={handleSignUpPress}
						position={{ top: 13, left: 0 }}
					/>


					<Popup
						isVisible={isPopupVisible}
						message={popupMessage}
						onClose={() => setIsPopupVisible(false)}
					/>


				</SafeAreaView>

			</ImageBackground>
		</KeyboardAvoidingView>


	)
};
export default SignupScreen;