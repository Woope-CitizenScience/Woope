import React, { useEffect, useRef, useState } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";


interface WelcomeBannerProps {
	username: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ username }) => {
	const uppercaseUsername = username.toUpperCase();

	return (
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
				{uppercaseUsername}
			</Text>
		</View>
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