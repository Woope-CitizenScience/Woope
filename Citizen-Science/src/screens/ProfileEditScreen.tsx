import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Modal,
	TextInput,
} from "react-native";
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getProfile, updateName } from "../api/community";
import IconButton from "../components/IconButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";
import { AuthContext } from "../util/AuthContext";

interface ProfileEditProps {
	navigation: any;
}

const ProfileEditScreen: React.FC<ProfileEditProps> = ({navigation}) => {

    let { userToken } = useContext(AuthContext);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const user_id = decodedToken ? decodedToken.user_id : null;

    const [editFirstName, setEditFirstName] = useState("");
	const [editLastName, setEditLastName] = useState("");

    useEffect(() => {
        if(user_id !== null)
		getProfile(user_id)
			.then((data) => {
				getProfile(data);
				setEditFirstName(data.user.first_name);
				setEditLastName(data.user.last_name);
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	}, []);

	const handleUpdateUserName = async () => {
		try {
			if (
				user_id !== null &&
				editFirstName !== undefined &&
				editLastName !== undefined
			) {
				const user = await updateName(
					user_id,
					editFirstName.trim(),
					editLastName.trim(),
					userToken
				);
				console.log("User name updated for USER: " + user.user_id);
			}
		} catch (error) {
			console.error("Errors: ", error);
		}
	};

	return (
		<View style={styles.container}>
			<View style={{ height: responsiveHeight(100), width: responsiveWidth(100), backgroundColor: "white" }}>
				<View
					style={[
						{
							justifyContent: "space-between",
							alignItems: "center",
							backgroundColor: "transparent",
							flexDirection: "row",
						},
					]}
				>
					<TouchableOpacity
						style={[{ padding: responsiveWidth(1) }]}
						onPress={() => navigation.goBack()}
					>
						<Icon name="arrow-back" size={responsiveWidth(7)} color="black" />
					</TouchableOpacity>
					<Text
						style={[
							styles.textUserInfo,
							{
								fontSize: responsiveFontSize(2.2),
							},
						]}
					>
						Edit Profile
					</Text>
					<TouchableOpacity
						style={[{ padding: responsiveWidth(1) }]}
						onPress={() => {
							handleUpdateUserName();
							navigation.goBack()
						}}
					>
						<Icon name="check" size={responsiveWidth(7)} color="black" />
					</TouchableOpacity>
				</View>
				<View
					style={[
						{
							paddingHorizontal: responsiveWidth(3),
							flex: 1,
							justifyContent: "flex-start",
							alignItems: "center",
							backgroundColor: "transparent",
							flexDirection: "column",
						},
					]}
				>
					{/* temp For Profile Picture */}
					<IconButton
						iconName={"circle"}
						onPress={() => void 0}
						iconSize={responsiveHeight(11)}
						iconColor={"lightblue"}
					/>
					<View style={styles.container}>
						<Text style={{ fontSize: responsiveFontSize(1.5) }}>
							First Name
						</Text>

						<TextInput
							style={[{ width: responsiveWidth(90) }]}
							onChangeText={(text) => setEditFirstName(text)}
							value={editFirstName}
						/>

						<View style={styles.line} />

						<Text style={{ fontSize: responsiveFontSize(1.5) }}>Last Name</Text>
						<TextInput
							style={[{ width: responsiveWidth(90) }]}
							onChangeText={(text) => setEditLastName(text)}
							value={editLastName}
						/>
						<View style={styles.line} />
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	posts: {
		justifyContent: "space-evenly",
		height: responsiveWidth(33),
		width: responsiveWidth(33),
	},
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		backgroundColor: "transparent",
		flexDirection: "column",
	},
	profileUser: {
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "transparent",
		height: responsiveHeight(11),
		width: responsiveWidth(100),
		flexDirection: "row",
	},
	attributes: {
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "transparent",
		flexDirection: "row",
	},
	textUserInfo: {
		fontSize: responsiveFontSize(1.8),
		fontWeight: "bold",
		color: "black",
		backgroundColor: "transparent",
		paddingHorizontal: responsiveWidth(3),
	},
	iconStyle: {
		justifyContent: "center",
		alignItems: "center",
		width: responsiveWidth(47),
		height: responsiveHeight(4.5),
		paddingHorizontal: responsiveWidth(0.5),
		marginEnd: responsiveWidth(2),
		backgroundColor: "lightblue",
		borderRadius: responsiveHeight(1),
	},
	line: {
		height: responsiveHeight(0.2),
		width: responsiveWidth(90),
		backgroundColor: "black",
		marginBottom: responsiveHeight(1),
	},
});

export default ProfileEditScreen;
