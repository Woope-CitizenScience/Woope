import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { mdiHome, mdiTestTube, mdiCalendar, mdiBookshelf, mdiMapMarker, mdiFileDocument } from '@mdi/js';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import CommunitySideMenu from './CommunitySideMenu';
import { MapScreen } from '../screens/Map/MapScreen';

import ResourceHome from '../screens/Organizations/ResourceHome';
import OrganizationCategory from '../screens/Organizations/OrganizationCategory';
import OrganizationFollowed from '../screens/Organizations/OrganizationFollowed';
import OrganizationSearch from '../screens/Organizations/OrganizationSearch';
import SpecificCategory from '../screens/Organizations/SpecificCategory';
import OrganizationProfile from '../screens/Organizations/OrganizationProfile';
import ResourceProfile from '../screens/Organizations/ResourceProfile';
import ManageOrganizations from '../screens/Organizations/ManageOrganizations';
import CreateOrganization from '../screens/Organizations/CreateOrganization';
import CreateCategory from '../screens/Organizations/CreateCategory';
import FeatureOrganization from '../screens/Organizations/FeatureOrganization';
import EventHome from '../screens/Events/EventHome';
import ReportScreen from '../screens/ReportScreen';
import DateScreen from '../screens/Calendar/dateScreen';
import OldCalendarScreen from '../screens/OldCalendarScreen'

const Tab = createBottomTabNavigator();
interface AnimatedTabIconProps {
    focused: boolean;
    IconPath: string;
}
const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ focused, IconPath }) => {
    const scale = useSharedValue(1);
    useEffect(() => {
        scale.value = withTiming(focused ? 1.5 : 1);
    }, [focused]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <Svg height="24" width="24" viewBox="0 0 24 24">
                <Path fill={focused ? '#007AFF' : 'black'} d={IconPath} />
            </Svg>
        </Animated.View>
    );
};
// Creating the resource stack to nest under the resource tab
const ResourceStack = createNativeStackNavigator();
const ResourceStackScreen = () => (
    <ResourceStack.Navigator screenOptions={{ headerShown: false }}>
        <ResourceStack.Screen name='ResourceHome' component={ResourceHome}/>
        <ResourceStack.Screen name='OrganizationCategory' component={OrganizationCategory}/>
        <ResourceStack.Screen name="OrganizationFollowed" component={OrganizationFollowed} />
        <ResourceStack.Screen name="OrganizationSearch" component={OrganizationSearch} />
        <ResourceStack.Screen name="SpecificCategory" component={SpecificCategory} />
        <ResourceStack.Screen name="OrganizationProfile" component={OrganizationProfile} />
        <ResourceStack.Screen name="ResourceProfile" component={ResourceProfile} />
        <ResourceStack.Screen name="ManageOrganizations" component={ManageOrganizations} />
        <ResourceStack.Screen name="CreateOrganization" component={CreateOrganization} />
        <ResourceStack.Screen name="CreateCategory" component={CreateCategory} />
        <ResourceStack.Screen name="FeatureOrganization" component={FeatureOrganization} />
        <ResourceStack.Screen name="EventHome" component={EventHome}/>
    </ResourceStack.Navigator>
)

const NavigationBar = () => {
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        let IconPath;
                        switch (route.name) {
                            case 'Home':
                                IconPath= mdiHome;
                                break;
                            case 'Calendar':
                                IconPath = mdiCalendar;
                                break;
                            case 'Resources':
                                IconPath = mdiBookshelf;
                                break;
                            case 'Map':
                                IconPath = mdiMapMarker;
                                break;
                            case 'Report':
                                IconPath = mdiFileDocument;
                                break;
                            default:
                                IconPath = mdiHome;
                        }
                        return <AnimatedTabIcon focused={focused} IconPath={IconPath} />;
                    },
                    tabBarActiveTintColor: 'blue',
                    tabBarInactiveTintColor: 'black',
                    tabBarStyle:{
                        backgroundColor: 'lightblue',
                        paddingBottom: 13,
                        paddingTop: 2,
                        height: 80,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,

                    },
                    tabBarLabelStyle: {
                        marginBottom: 3,
                    },
                })}
            >
                <Tab.Screen name="Home" component={CommunitySideMenu} />
                <Tab.Screen name="Calendar" component={CalendarScreen} />
                <Tab.Screen name="Resources" component={ResourceStackScreen} />
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Report" component={ReportScreen} />
            </Tab.Navigator>
        </View>
    );
};
export default NavigationBar;