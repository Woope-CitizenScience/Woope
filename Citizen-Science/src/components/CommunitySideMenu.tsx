import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
	createDrawerNavigator,
} from "@react-navigation/drawer";

import React, { useContext } from "react";
import { getHeaderTitle } from "@react-navigation/elements";
import ScreenHeader from "./ScreenHeader";
import HomeScreen from "../screens/HomeScreen";
import { Button, View } from "react-native";
import {
	DrawerNavigationHelpers,
	DrawerDescriptorMap,
} from "@react-navigation/drawer/lib/typescript/src/types";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";
import Logout from "./Logout";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../util/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerSideMenu(
	props: React.JSX.IntrinsicAttributes & {
		state: DrawerNavigationState<ParamListBase>;
		navigation: DrawerNavigationHelpers;
		descriptors: DrawerDescriptorMap;
	}
) {
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props} />
			<Logout />
		</DrawerContentScrollView>
	);
}

const ProfileStackNavigator = ({ ...props }) => {
	return (
		<Stack.Navigator
			initialRouteName={"ProfileScreen"}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name="ProfileScreen"
				initialParams={{ userID: props.userID }}
				component={ProfileScreen}
			/>
			<Stack.Screen
				name="ProfileEditScreen"
				initialParams={{ userID: props.userID }}
				component={ProfileEditScreen}
			/>
		</Stack.Navigator>
	);
};

function CommunitySideMenu() {
	let { userToken } = useContext(AuthContext);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const currentUserID= decodedToken ? decodedToken.user_id : null;

	return (
		<View style={{ flex: 1 }}>
			<Drawer.Navigator
				defaultStatus="closed"
				screenOptions={{
					header: ({ navigation, route, options }) => {
						const title = getHeaderTitle(options, route.name);

						return <ScreenHeader title={title} navigation={navigation} />;
					},
				}}
				drawerContent={(props) => <CustomDrawerSideMenu {...props} />}
			>
				{/*place holder	*/}

				<Drawer.Screen name="Community Home" component={HomeScreen} />
				<Drawer.Screen
					name="Profile"
					children={(props) => (
						<ProfileStackNavigator {...props} userID={currentUserID}/>
					)}
				/>
			</Drawer.Navigator>
		</View>
	);
}

export default CommunitySideMenu;