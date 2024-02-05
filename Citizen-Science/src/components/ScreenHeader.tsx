import { View, StyleSheet, Button } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import IconButton from "./IconButton";


interface ScreenHeaderProps {
	title: string;
	navigation: any,
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, navigation}) => {
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView>
			<View
				style={[
					styles.container,
					{
						backgroundColor: "lightblue",
						height: responsiveHeight(8),
					},
				]}
			>
				<IconButton
					iconName={"menu"}
					onPress={() => {navigation.openDrawer()}}
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