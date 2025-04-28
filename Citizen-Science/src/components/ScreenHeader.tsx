import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import IconButton from "./IconButton";
import React from "react";

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
					paddingVertical={responsiveHeight(1)}
					paddingHorizontal={responsiveHeight(1)}
				></IconButton>

				{/* <IconButton
					iconName={"person"}
					onPress={() => nav.navigate("EventHome")}
					iconSize={responsiveHeight(4.5)}
					iconColor={"black"}
					paddingVertical={responsiveHeight(1)}
					paddingHorizontal={responsiveHeight(1)}
				/> */}

				{/* Maybe Add title */}
			</View>
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
