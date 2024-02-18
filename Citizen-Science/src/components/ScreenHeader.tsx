import { View, StyleSheet, Button, Animated, LayoutAnimation } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import IconButton from "./IconButton";
import React, { useEffect, useRef, useState, useTransition } from "react";
import WelcomeBanner from "./WelcomeBanner";

interface ScreenHeaderProps {
	title: string;
	navigation: any;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, navigation }) => {
	const insets = useSafeAreaInsets();

	function WelcomeFadeAway() {
		const [shouldRender, setShouldRender] = useState(true);
		const position = useRef(new Animated.Value(0)).current;

		{/* Make this persit screen change or refresh */}
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
			}, 2000);
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
				style={[{zIndex:1, transform: [{ translateY: position }], opacity }]}
			>
				<WelcomeBanner username={"Placeholder "} />
			</Animated.View>
		);
	}

	return (
		<SafeAreaView>
			<View
				style={[
					styles.container,
					{
						zIndex:2,
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
