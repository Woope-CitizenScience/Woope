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
			<WelcomeBanner/>
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
