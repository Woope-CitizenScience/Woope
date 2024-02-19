import { View, StyleSheet, Animated, LayoutAnimation } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import IconButton from "./IconButton";
import React, { useContext, useEffect, useRef, useState } from "react";
import WelcomeBanner from "./WelcomeBanner";
import { AuthContext } from "../util/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";

interface ScreenHeaderProps {
	title: string;
	navigation: any;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, navigation }) => {
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

	function WelcomeFadeAway() {
		const [shouldRender, setShouldRender] = useState(true);
		const position = useRef(new Animated.Value(0)).current;

		{
			/* Make this persit screen change or refresh */
		}
		useEffect(() => {
			const timer = setTimeout(() => {
				Animated.timing(position, {
					toValue: responsiveHeight(-10),
					duration: 600,
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
				<WelcomeBanner username={checkNames(firstName, lastName)} />
			</Animated.View>
		);
	}

	return (
		<SafeAreaView>
			<View
				style={[
					styles.container,
					{
						zIndex: 2,
						backgroundColor: "lightblue",
						height: responsiveHeight(8),
					},
				]}
			>
				<IconButton
					iconName={"menu"}
					onPress={() => {
						navigation.openDrawer();
					}}
					iconSize={responsiveHeight(4.5)}
					iconColor={"black"}
					paddingVertical={3}
					paddingHorizontal={3}
				></IconButton>

				<IconButton
					iconName={"person"}
					onPress={function (): void {}}
					iconSize={responsiveHeight(4.5)}
					iconColor={"black"}
					paddingVertical={3}
					paddingHorizontal={3}
				/>

				{/* Maybe Add title */}
			</View>
			<WelcomeFadeAway />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingLeft: responsiveWidth(4),
		paddingRight: responsiveWidth(4),
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
	},
});

export default ScreenHeader;
