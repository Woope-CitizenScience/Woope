import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import { mdiHome, mdiTestTube, mdiCalendar, mdiBookshelf, mdiMapMarker } from '@mdi/js';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import ResourceScreen from '../screens/ResourceScreen';
import CitizenScienceScreen from '../screens/CitizenScience';

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let IconPath;
                    switch (route.name) {
                        case 'Home':
                            IconPath= mdiHome;
                            break;
                        case 'CitizenScience':
                            IconPath = mdiTestTube;
                            break;
                        case 'Calendar':
                            IconPath = mdiCalendar;
                            break;
                        case 'Resource':
                            IconPath = mdiBookshelf;
                            break;
                        case 'Map':
                            IconPath = mdiMapMarker;
                            break;
                        default:
                            IconPath = mdiHome;
                    }

                    return (
                        <Svg height={size} width={size} viewBox="0 0 24 24">
                            <Path fill={color} d={IconPath} />
                        </Svg>
                    );
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="CitizenScience" component={CitizenScienceScreen} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Resource" component={ResourceScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
        </Tab.Navigator>
    );
};
export default NavigationBar;