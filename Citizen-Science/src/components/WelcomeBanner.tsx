import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Animated,
	LayoutAnimation,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import { AuthContext } from "../util/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";


const WelcomeBanner = () => {
	const { userToken } = useContext(AuthContext);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const firstName = decodedToken ? decodedToken.firstName : null;
	const lastName = decodedToken ? decodedToken.lastName : null;

	function checkNames(firstName: string | null, lastName: string | null) {
		if (firstName === null && lastName === null) {
			return "Community Forum";
		} else if (firstName === null) {
			return "" + lastName;
		} else if (lastName === null) {
			return "" + firstName;
		} else {
			return firstName + " " + lastName;
		}
	}

	const [shouldRender, setShouldRender] = useState(true);
	const position = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const timer = setTimeout(() => {
			Animated.timing(position, {
				toValue: responsiveHeight(-10),
				duration: 400,
				useNativeDriver: true,
			}).start(() => {
				LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
				setShouldRender(false);
			});
		}, 3500);
		return () => clearTimeout(timer);
	}, []);

	const opacity = position.interpolate({
		inputRange: [responsiveHeight(-5), 1],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	if (!shouldRender) {
		return null;
	}

	return (
		<Animated.View
			style={[{ zIndex: 1, transform: [{ translateY: position }], opacity }]}
		>
			<View style={styles.container}>
				<Text
					style={{
						fontSize: responsiveFontSize(3),
						fontWeight: "bold",
					}}
				>
					Welcome,
				</Text>
				<Text
					style={{
						fontSize: responsiveFontSize(5),
						fontWeight: "bold",
						color: "white",
					}}
				>
					{checkNames(firstName, lastName)}
				</Text>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: responsiveWidth(100),
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		backgroundColor: "lightblue",

		shadowColor: "black",
		shadowOffset: {
			width: responsiveWidth(0),
			height: responsiveHeight(2),
		},
		shadowOpacity: 0.25,
		shadowRadius: 3,
		elevation: responsiveHeight(0),

		paddingTop: responsiveHeight(1),
		paddingBottom: responsiveHeight(1),
		paddingLeft: responsiveWidth(5),
		paddingRight: responsiveWidth(1),

		overflow: "hidden",
	},
});
export default WelcomeBanner;
