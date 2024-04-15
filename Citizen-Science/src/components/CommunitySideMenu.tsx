import {
	DrawerContentScrollView,
	DrawerItemList,
	createDrawerNavigator,
} from "@react-navigation/drawer";

import React, { useContext } from "react";
import { getHeaderTitle } from "@react-navigation/elements";
import ScreenHeader from "./ScreenHeader";
import HomeScreen from "../screens/HomeScreen";
import { View } from "react-native";
import {
	DrawerNavigationHelpers,
	DrawerDescriptorMap,
} from "@react-navigation/drawer/lib/typescript/src/types";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";
import Logout from "./Logout";

import { AuthContext } from "../util/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";
import ProfileSearchScreen from "../screens/ProfileSearchScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileStackNavigator from "./ProfileStackNav";

const Drawer = createDrawerNavigator();

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

const Stack = createNativeStackNavigator();


const SearchStackNavigator = ({ ...props }) => {
	return (
		<Stack.Navigator
			initialRouteName={"SearchPage"}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name={"SearchPage"}
				initialParams={{ headerShown: false }}
				component={ProfileSearchScreen}
			></Stack.Screen>
			<Stack.Screen
				name={"ProfileScreenSearchNav"}
				initialParams={{headerShown: false}}
				component={ProfileStackNavigator}
			></Stack.Screen>
		</Stack.Navigator>
	);
};



function CommunitySideMenu() {
	let { userToken } = useContext(AuthContext);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const currentUserID = decodedToken ? decodedToken.user_id : null;

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
						<ProfileStackNavigator {...props} userID={currentUserID} />
					)}
				/>
				<Drawer.Screen
					name="Search"
					component={SearchStackNavigator}
				></Drawer.Screen>
			</Drawer.Navigator>
		</View>
	);
}

export default CommunitySideMenu;
