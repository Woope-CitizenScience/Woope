import {
	TouchableOpacity,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import { IconButtonProps } from "../types";
import styles from "../StyleSheet";
import React from "react";

const IconButton: React.FC<IconButtonProps> = ({
	iconName,
	onPress,
	iconSize,
	iconColor,
	borderWidth,
	borderRadius,
	borderColor,
	height,
	width,
	backgroundColor,
	paddingHorizontal,
	paddingTop,
	paddingBottom,
	paddingLeft,
	paddingRight,
	paddingVertical,
}) => {
	const iconStyle: ViewStyle = {
		borderWidth,
		borderRadius,
		borderColor,
		height,
		width,
		backgroundColor,
		paddingHorizontal,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		paddingVertical,
	};

	return (
		<TouchableOpacity onPress={onPress} style={[iconStyle]}>
			<Icon name={iconName} size={iconSize} color={iconColor}></Icon>
		</TouchableOpacity>
	);
};

export default IconButton;