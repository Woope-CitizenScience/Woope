import {
	Text,
	Image,
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
import { getProfile, updateName, updatePfp } from "../../api/community";
import IconButton from "../../components/IconButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../../util/token";
import { AuthContext } from "../../util/AuthContext";
import * as ImagePicker from 'expo-image-picker';
import { logActivity } from "../../api/activity";

interface ProfileEditProps {
	navigation: any;
}

const ProfileEditScreen: React.FC<ProfileEditProps> = ({ navigation }) => {
	let { userToken } = useContext(AuthContext);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const user_id = decodedToken ? decodedToken.user_id : NaN;

	const [editFirstName, setEditFirstName] = useState("");
	const [editLastName, setEditLastName] = useState("");
	const [newPfp, setNewPfp] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	{
		/* Will load profile data of user */
	}
	useEffect(() => {
		if (user_id !== null)
			getProfile(user_id)
				.then((data) => {
					getProfile(data);
					setEditFirstName(data.user.first_name);
					setEditLastName(data.user.last_name);
					setImageUrl(`${process.env.EXPO_PUBLIC_API_URL}${data.user.image_url}`)
				})
				.catch((error) => {
					console.error("Error: ", error);
				});
	}, []);

	{
		/* Calls updateName api to set users name */
	}
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
				logActivity(user_id, `Updated username`)
			}
		} catch (error) {
			console.error("Errors: ", error);
		}
	};

	const handleEditPfp = async() => {
		const result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					quality: 1,
					// exif: false
				});

		if(!result.canceled){
			const imageUri = result.assets[0].uri
			setNewPfp(imageUri)
			setImageUrl(imageUri)
			logActivity(user_id, `Selected a new profile picture`)
		}

	}

	const handleUpdatePfp = async() => {
		try {
			if(newPfp){
				await updatePfp(user_id + "", newPfp)
				logActivity(user_id, `Updated profile picture`)
			}
			
		} catch (error) {
			console.error("Errors: ", error);
		}
	}

	return (
		<View style={styles.container}>
			<View
				style={{
					height: responsiveHeight(100),
					width: responsiveWidth(100),
					backgroundColor: "white",
				}}
			>
				{/* Back button, Screen title, and confirmation button*/}
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
						<Icon
							name="arrow-back"
							size={responsiveHeight(4.2)}
							color="black"
						/>
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
							handleUpdatePfp();
							navigation.goBack();
						}}
					>
						<Icon name="check" size={responsiveHeight(4.2)} color="black" />
					</TouchableOpacity>
				</View>
				{/* Profile editable attributes */}
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
					{/* <IconButton
						iconName={"circle"}
						onPress={handleEditPfp}
						iconSize={responsiveHeight(11)}
						iconColor={"lightblue"}
					/> */}
					<TouchableOpacity onPress={handleEditPfp}>
						<Image
							source={{ uri: imageUrl }}
							style={{ width: responsiveHeight(11), height: responsiveHeight(11), borderRadius: responsiveHeight(11) / 2 }}
							resizeMode="cover"
						/>
					</TouchableOpacity>
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
