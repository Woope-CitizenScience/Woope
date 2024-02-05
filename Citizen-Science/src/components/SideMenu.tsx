import {
	DrawerItem,
	DrawerItemList,
	createDrawerNavigator,
} from "@react-navigation/drawer";

import React from "react";

import CalendarScreen from "../screens/CalendarScreen";

import { getHeaderTitle } from "@react-navigation/elements";
import ScreenHeader from "./ScreenHeader";
import CitizenScreen from "../screens/CitizenScience";

const Drawer = createDrawerNavigator();

function SideMenu() {
	return (
		<Drawer.Navigator
			defaultStatus="closed"
			screenOptions={{ 
                header: ({ navigation, route, options }) => {
                    const title = getHeaderTitle(options, route.name);
                  
                    return <ScreenHeader title={title} navigation={navigation}/>;
                },
                
            }}
		>
			{/*place holder	*/}
			<Drawer.Screen name="Screen :p" component={CalendarScreen} />
			<Drawer.Screen name="Screen 2:p" component={CitizenScreen} />
		</Drawer.Navigator>
	);
}

export default SideMenu;