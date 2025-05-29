import React, { useContext, useState } from 'react';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { ImageBackground, SafeAreaView, Platform, KeyboardAvoidingView, Text, View, TouchableOpacity, Alert } from "react-native";
import axios from 'axios';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useRef } from 'react';

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
	dateOfBirth: Date | null;
	password: string;
}

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Signup'>;

const SignupScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const [userInfo, setUserInfo] = useState<UserInfo>({
		firstName: '',
		lastName: '',
		dateOfBirth: null,
		email: '',
		password: ''
	});

	const [showPassword, setShowPassword] = useState(false);

	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState('');

	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');

	const showPopup = (messages: string[]) => {
		const formattedMessages = messages.map(message => `\u2022 ${message}`).join('\n');
		setPopupMessage(formattedMessages);
		setIsPopupVisible(true);
	};




	const [errors, setErrors] = useState<Errors>({});
	const { setUserToken } = useContext(AuthContext);

	const handleInputChange = (field: keyof UserInfo, value: string | Date | null) => {
		setUserInfo(prevState => ({ ...prevState, [field]: value }));
	};


	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const showDatePicker = () => setDatePickerVisibility(true);
	const hideDatePicker = () => setDatePickerVisibility(false);
	const handleConfirm = (date: Date) => {
		handleInputChange('dateOfBirth', date);
		hideDatePicker();
	};

	const handleSignUpPress = async () => {
		if (!otpSent) {
			if (validate()) {
				try {
					if (!apiUrl) {
						console.log('API URL not defined. Check your app config or environment.');
						return;
					}
					await axios.post(`${apiUrl}/otp/send-otp`, { email: userInfo.email });
					setOtpSent(true);
					Alert.alert('OTP Sent', 'Please check your email for the OTP.');
				} catch (error) {
					console.log('Error sending OTP', error);
					Alert.alert('Error', 'Failed to send OTP. Please try again.');
				}
			}
		} else {
			try {
				const verifyRes = await axios.post(`${apiUrl}/otp/verify-otp`, {
					email: userInfo.email,
					otp,
				});

				console.log("OTP Verification Response:", verifyRes.data);
				// Updated condition to handle boolean and object with success/verified property
				if (verifyRes.data === true || verifyRes.data.success === true || verifyRes.data.verified === true) {
					console.log("OTP verified. Proceeding to register user.");
					try {
						const response = await registerUser(
							userInfo.email,
							userInfo.password,
							userInfo.firstName,
							userInfo.lastName,
							'',// userInfo.dateOfBirth ? moment(userInfo.dateOfBirth).format('MM/DD/YY') : '',
							otp
						);
						console.log("User registration successful.");
						await storeToken('accessToken', response.accessToken);
						await storeToken('refreshToken', response.refreshToken);
						setUserToken(response.accessToken);
					} catch (regError) {
						console.log('User registration failed:', regError);
						Alert.alert('Registration Error', 'Failed to register user. Please try again.');
					}
				} else {
					Alert.alert('Invalid OTP', 'Please enter the correct OTP sent to your email.');
				}
				console.log("Reached end of OTP flow but user not created.");
			} catch (error) {
				console.log('OTP verification failed', error);
				Alert.alert('Error', 'OTP verification failed. Try again.');
			}
		}
	};
	const validate = (): boolean => {
		let newErrors: Errors = {};
		let isValid = true;
		let errorMessages: string[] = [];

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

		// if (!userInfo.dateOfBirth) {
		// 	newErrors.dateOfBirth = 'Birth date is required';
		// 	isValid = false;
		// 	errorMessages.push('Birth date is required');
		// }


		setErrors(newErrors);

		if (!isValid) {
			showPopup(errorMessages);
		}

		return isValid;
	};





	return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 200 : 0}>

            <ImageBackground
                source={require('../../assets/background1.png')}
                style={{ flex: 1, width: '100%', height: '100%' }}>


					<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

					{/* Blobs, Logo, Back button */}

					<Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 6, left: 80 }} />
					<Blobs rotationDeg={'0deg'} widthPercentage={6} heightPercentage={3} position={{ top: 15, left: 93 }} />
					<BackButton position={{ top: -8, left: -45 }} />

					<ScreenTitle
						text={'Create an \nAccount'}
						textStyle={'title'}
						fontSize={5}
						color={'white'}
						position={{ top: 5, left: -20 }}
					/>

					{/* First & Last Name */}
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: responsiveWidth(70), marginTop: responsiveHeight(30) }}>
						<CustomTextField
						size={{ width: responsiveWidth(33), height: responsiveHeight(5.5) }}
						placeholder="First Name"
						value={userInfo.firstName}
						onChangeText={(value) => handleInputChange('firstName', value)}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top: 0, left: 0 }}
						/>
						<CustomTextField
						size={{ width: responsiveWidth(33), height: responsiveHeight(5.5) }}
						placeholder="Last Name"
						value={userInfo.lastName}
						onChangeText={(value) => handleInputChange('lastName', value)}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top: 0, left: 0 }}
						/>
					</View>

					{/* Birth Date */}
					{/* <TouchableOpacity
						onPress={showDatePicker}
						style={{
						width: responsiveWidth(70),
						height: responsiveHeight(5.5),
						borderWidth: 1,
						borderColor: '#5EA1E9',
						borderRadius: 10,
						justifyContent: 'center',
						paddingLeft: 10,
						marginTop: responsiveHeight(1.5),
						}}
					>
						<Text style={{ color: userInfo.dateOfBirth ? 'black' : '#A9A9A9' }}>
						{userInfo.dateOfBirth ? moment(userInfo.dateOfBirth).format('MMM D, YYYY') : 'Birth Date'}
						</Text>
					</TouchableOpacity>

						{isDatePickerVisible && (
						<DateTimePicker
							value={userInfo.dateOfBirth || new Date()}
							mode="date"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							maximumDate={new Date()}
							onChange={(event, selectedDate) => {
							if (event.type === 'set' && selectedDate) {
								handleInputChange('dateOfBirth', selectedDate);

								if (timeoutRef.current) {
								clearTimeout(timeoutRef.current);
								}

								timeoutRef.current = setTimeout(() => {
								hideDatePicker();
								}, 3000);
							} else if (event.type === 'dismissed') {
								hideDatePicker();
							}
							}}
						/>
						)}
					*/}
					{/* Email */}
					<CustomTextField
						size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
						placeholder="Email"
						value={userInfo.email}
						onChangeText={(value) => handleInputChange('email', value)}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top:1.5, left: 0 }}
						textContentType={'oneTimeCode'}
					/>

					{/* Password + Eye Toggle */}
					<View
						style={{
						width: responsiveWidth(70),
						height: responsiveHeight(5.5),
						marginTop: responsiveHeight(1),
						position: 'relative',
						top: responsiveHeight(2),
						}}
					>
						<CustomTextField
						size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
						placeholder="Password"
						value={userInfo.password}
						onChangeText={(value) => handleInputChange('password', value)}
						secureTextEntry={!showPassword}
						borderColor="#5EA1E9"
						borderRadius={10}
						position={{ top: 0, left: 0 }}
						textContentType={'oneTimeCode'}
						/>
						<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
						style={{
							position: 'absolute',
							right: 10,
							top: responsiveHeight(1.7),
							height: responsiveHeight(2),
							justifyContent: 'center',
							alignItems: 'center',
						}}
						>
						<Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#5EA1E9" />
						</TouchableOpacity>
					</View>
					{/* OTP TextField shown after password, if otpSent */}
					{otpSent && (
						<CustomTextField
							size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
							placeholder="Enter OTP"
							value={otp}
							onChangeText={(value) => setOtp(value)}
							borderColor="#5EA1E9"
							borderRadius={10}
							position={{ top: 17, left: 0 }}
						/>
					)}
					{/* Signup Button */}
					<CustomButton
						size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
						label="Sign Up"
						labelColor="white"
						backgroundColor="#5EA1E9"
						onPress={handleSignUpPress}
						position={{ top: responsiveHeight(.4), left: 0 }}
					/>

					{/* Popup */}
					<Popup
						isVisible={isPopupVisible}
						message={popupMessage}
						onClose={() => setIsPopupVisible(false)}
					/>

					<LogoName position={'bottomRight'} color={'grey'} />

					</SafeAreaView>



            </ImageBackground>
        </KeyboardAvoidingView>
    );
};
export default SignupScreen;