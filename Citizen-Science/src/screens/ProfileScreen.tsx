import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	ActivityIndicator,
} from "react-native";
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import React, { useCallback, useContext, useState } from "react";
import {
	checkFollowStatus,
	followProfile,
	getProfile,
	unfollowProfile,
} from "../api/community";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";
import { AuthContext } from "../util/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

interface ProfileScreenProps {
	route: any;
	navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
	const { userID } = route.params;

	let { userToken } = useContext(AuthContext);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const currentUserID = decodedToken ? decodedToken.user_id : null;

	const [profileOwner, setProfileOwner] = useState(false);

	const [fullyLoaded, setFullyLoaded] = useState(false);

	const [editFirstName, setFirstName] = useState("");
	const [editLastName, setLastName] = useState("");

	const [following, setFollowing] = useState(false);
	const [followerCount, setFollowerCount] = useState("");
	const [followingCount, setFollowingCount] = useState("");

	const fetchProfile = useCallback(() => {
		if (userID === currentUserID) {
			setProfileOwner(true);
		}
		getProfile(userID)
			.then((data) => {
				setFirstName(data.user.first_name);
				setLastName(data.user.last_name);

				setFollowerCount(data.followerCount.follower_of_count);
				setFollowingCount(data.followingCount.following_of_count);
				setFullyLoaded(true);
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
		if (!profileOwner) {
			checkFollowStatus(userID, userToken)
				.then((data) => {
					if (data !== 0) {
						if (data.followStatus.status === 1) {
							setFollowing(true);
						}
					} else {
						setFollowing(false);
					}
				})
				.catch((error) => {
					console.error("Error: ", error);
				});
		}
	}, [userID, currentUserID]);

	useFocusEffect(fetchProfile);

	const handleFollowProfile = async () => {
		try {
			if (!following) {
				const user = await followProfile(userID, userToken);
				setFollowing(true);
			}
		} catch (error) {
			console.error("Errors: ", error);
		}
	};

	const handleUnfollowProfile = async () => {
		try {
			if (following) {
				const user = await unfollowProfile(userID, userToken);
				setFollowing(false);
			}
		} catch (error) {
			console.error("Errors: ", error);
		}
	};
	const posts = [
		{ id: "1", content: "|||First post|||" },
		{ id: "2", content: "|Second post" },
		{ id: "3", content: "|Third post" },
		{ id: "4", content: "|fourth post" },
		{ id: "5", content: "|Fifth post" },
		{ id: "1", content: "|||First post|||" },
		{ id: "2", content: "|Second post" },
		{ id: "3", content: "|Third post" },
		{ id: "4", content: "|fourth post" },
		{ id: "5", content: "|Fifth post" },
	];

	if (!fullyLoaded) {
		return (
			<View
				style={{
					alignContent: "flex-start",
					paddingTop: responsiveHeight(10),
				}}
			>
				<ActivityIndicator size={"large"} color={"lightblue"} />
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<FlatList
				style={[{ width: responsiveWidth(100) }]}
				data={posts}
				keyExtractor={(item) => item.id}
				numColumns={3}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={!fullyLoaded} onRefresh={fetchProfile} />
				}
				ListHeaderComponent={
					<>
						<View style={styles.profileUser}>
							{/* temp For Profile Picture */}
							<View
								style={{
									height: responsiveHeight(9),
									width: responsiveHeight(9),
									borderRadius: 50,
									backgroundColor: "lightblue",
								}}
							></View>
							<View style={styles.attributes}>
								<TouchableOpacity
									onPress={void 0}
									style={styles.textAttributes}
								>
									<Text style={styles.textUserInfo}>Posts</Text>
									<Text style={styles.textUserInfo}>999999999</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("ProfileFollowersScreen", {
											userID: userID,
										})
									}
									style={styles.textAttributes}
								>
									<Text style={styles.textUserInfo}>{"Followers "}</Text>
									<Text style={styles.textUserInfo}>{followerCount}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("ProfileFollowingScreen", {
											userID: userID,
										})}
									style={styles.textAttributes}
								>
									<Text style={styles.textUserInfo}>{"Following "}</Text>
									<Text style={styles.textUserInfo}>{followingCount}</Text>
								</TouchableOpacity>
							</View>
						</View>
						<Text
							style={{
								fontSize: responsiveFontSize(1.8),
								fontWeight: "bold",
								color: "black",
								paddingStart: responsiveWidth(2),
								paddingBottom: responsiveHeight(1),
								backgroundColor: "transparent",
							}}
						>
							{editFirstName + " " + editLastName}
						</Text>
						{profileOwner && (
							<View
								style={[
									styles.attributes,
									{
										paddingHorizontal: responsiveWidth(2),
										paddingBottom: responsiveHeight(1),
									},
								]}
							>
								<TouchableOpacity
									onPress={() => navigation.navigate("ProfileEditScreen")}
									style={styles.iconStyle}
								>
									<Text
										style={{
											fontSize: responsiveFontSize(1.8),
											fontWeight: "bold",
											color: "black",
										}}
									>
										Edit Profile
									</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={void 0} style={styles.iconStyle}>
									<Text
										style={{
											fontSize: responsiveFontSize(1.8),
											fontWeight: "bold",
											color: "black",
										}}
									>
										Share Profile
									</Text>
								</TouchableOpacity>
							</View>
						)}
						{!profileOwner && (
							<View
								style={[
									styles.attributes,
									{
										paddingHorizontal: responsiveWidth(2),
										paddingBottom: responsiveHeight(1),
									},
								]}
							>
								{!following && (
									<TouchableOpacity
										onPress={() => handleFollowProfile()}
										style={styles.iconStyle}
									>
										<Text
											style={{
												fontSize: responsiveFontSize(1.8),
												fontWeight: "bold",
												color: "black",
											}}
										>
											Follow Profile
										</Text>
									</TouchableOpacity>
								)}
								{following && (
									<TouchableOpacity
										onPress={() => handleUnfollowProfile()}
										style={styles.iconStyle}
									>
										<Text
											style={{
												fontSize: responsiveFontSize(1.8),
												fontWeight: "bold",
												color: "black",
											}}
										>
											Following
										</Text>
									</TouchableOpacity>
								)}

								<TouchableOpacity onPress={void 0} style={styles.iconStyle}>
									<Text
										style={{
											fontSize: responsiveFontSize(1.8),
											fontWeight: "bold",
											color: "black",
										}}
									>
										Share Profile
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</>
				}
				renderItem={({ item, index }) => {
					let marginLeft = 0;
					let marginRight = 0;
					let marginBottom = responsiveWidth(0.5);
					if (index % 3 === 1) {
						marginLeft = responsiveWidth(0.5);
						marginRight = responsiveWidth(0.5);
					}
					return (
						<View
							style={[
								styles.posts,
								{
									marginRight,
									marginLeft,
									marginBottom,
									backgroundColor: "grey",
								},
							]}
						>
							<Text
								style={[
									{
										height: responsiveWidth(33),
										width: responsiveWidth(33),
										backgroundColor: "transparent",
									},
								]}
							>
								{item.content}
							</Text>
						</View>
					);
				}}
			/>
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
		backgroundColor: "white",
		flexDirection: "column",
	},
	profileUser: {
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "transparent",
		height: responsiveHeight(11),
		width: responsiveWidth(100),
		paddingLeft: responsiveWidth(2),
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
	textAttributes: {
		justifyContent: "center",
		alignItems: "center",
		width: responsiveWidth(27),
		height: responsiveHeight(8),
		paddingHorizontal: responsiveWidth(0.5),
		backgroundColor: "transparent",
		borderRadius: responsiveHeight(1),
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

export default ProfileScreen;
