import {
	View,
	StyleSheet,
	FlatList,
	TextInput,
	Text,
	Pressable,
} from "react-native";
import { useEffect, useMemo } from "react";
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from "react-native-responsive-dimensions";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { searchProfile } from "../../api/community";

interface ProfileSearchScreenProps {
	route: any;
	navigation: any;
}

const ProfileSearchScreen: React.FC<ProfileSearchScreenProps> = ({
	route,
	navigation,
}) => {
	const [searchName, setSearchName] = useState({
		textString: "",
	});

	const [searchResults, setSearchResults] = useState([]);
	const [renderSearch, setRenderSearch] = useState(false);

	const navigateToProfile = (user_id: number) => {
		navigation.navigate("ProfilePage", {
			screen: "ProfileScreen",
			params: { userID: user_id },
		});
	};

	const handleSearch = async (text: string) => {
		if (text.length < 1) {
			setRenderSearch(false);
			return;
		}

		try {
			const users = await searchProfile(text.replaceAll(" ", ""));
			if (!users) {
				setRenderSearch(false);
			} else {
				console.log(users);
				setSearchResults(users);
				setRenderSearch(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleTextChange = (text: string) => {
		setSearchName((prevState) => ({ ...prevState, textString: text }));
		handleSearch(text);
	};
	return (
		<View style={styles.container}>
			<View
				style={[
					{
						flexDirection: "row",
						alignItems: "center",
						width: responsiveWidth(100),
						backgroundColor: "transparent",
						paddingLeft: responsiveWidth(5),
						paddingTop: responsiveHeight(2),
					},
				]}
			>
				<View
					style={{
						width: responsiveWidth(90),
						borderWidth: 1,
						paddingHorizontal: 10,
						borderRadius: 5,
						backgroundColor: "lightgrey",
						borderColor: "lightgrey",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Icon name={"search"} size={responsiveWidth(5)} color={"grey"}></Icon>
					<TextInput
						style={[
							{
								width: responsiveWidth(80),
								paddingHorizontal: responsiveWidth(1.5),
								paddingVertical: responsiveHeight(0.5),
								fontSize: responsiveFontSize(2),
								textAlignVertical: "center",
							},
						]}
						onChangeText={(text) => handleTextChange(text)}
						placeholder="Search"
						placeholderTextColor={"grey"}
					></TextInput>
				</View>
			</View>
			<View style={{}}>
				{renderSearch && (
					<FlatList
						data={searchResults}
						renderItem={({ item }) => (
							<>
								<View
									style={{
										flex: 1,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "center",
										paddingTop: responsiveHeight(1),
									}}
								>
									<Pressable
										onPressOut={() =>
											navigateToProfile((item as { user_id: number }).user_id)
										}
										style={({ pressed }) => [
											{
												backgroundColor: pressed ? "lightgrey" : "white",
											},
											{
												flexDirection: "row",
												paddingVertical: responsiveHeight(0.5),
												paddingHorizontal: responsiveWidth(3),
												borderRadius: 5,
												width: responsiveWidth(100),
											},
										]}
									>
										{/* temp For Profile Picture */}
										<View
											style={{
												height: responsiveHeight(5),
												width: responsiveHeight(5),
												borderRadius: 50,
												backgroundColor: "lightblue",
											}}
										></View>

										<View
											style={{
												maxWidth: responsiveWidth(80),
												backgroundColor: "white",
												flexDirection: "column",
											}}
										>
											<Text
												style={{
													paddingStart: responsiveWidth(2),
													maxWidth: responsiveWidth(80),
													backgroundColor: "transparent",
													verticalAlign: "top",
												}}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												{
													(item as { first_name: string; last_name: string })
														.first_name
												}{" "}
												{
													(item as { first_name: string; last_name: string })
														.last_name
												}
											</Text>
											{/* 
												Next item will appear under of name.
											*/}
										</View>
										{/* 
											Next item will appear right of name.
											Don't
										*/}
									</Pressable>
								</View>
							</>
						)}
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		backgroundColor: "white",
		flexDirection: "column",
	},
});

export default ProfileSearchScreen;