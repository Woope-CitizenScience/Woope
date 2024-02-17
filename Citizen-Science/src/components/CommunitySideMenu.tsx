import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
	createDrawerNavigator,
} from "@react-navigation/drawer";

import React from "react";
import { getHeaderTitle } from "@react-navigation/elements";
import ScreenHeader from "./ScreenHeader";
import HomeScreen from "../screens/HomeScreen";
import { Button, View } from "react-native";
import {
	DrawerNavigationHelpers,
	DrawerDescriptorMap,
} from "@react-navigation/drawer/lib/typescript/src/types";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";

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
			<DrawerItem label="Other" onPress={() => {}} />
		</DrawerContentScrollView>
	);
}

function CommunitySideMenu() {
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
			</Drawer.Navigator>
		</View>
	);
}

export default CommunitySideMenu;
