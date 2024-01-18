import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { mdiHome, mdiTestTube, mdiCalendar, mdiBookshelf, mdiMapMarker } from '@mdi/js';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import ResourceScreen from '../screens/ResourceScreen';
import CitizenScienceScreen from '../screens/CitizenScience';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";

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
                {/* Todo: Add responsive lib to height and width of icons */}
                <Svg height="24" width="24" viewBox="0 0 24 24">
                    <Path fill={focused ? '#0059ed' : 'white'} d={IconPath} />
                </Svg>
            </Animated.View>
        );
};

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
                            case 'Science':
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
                        return <AnimatedTabIcon focused={focused} IconPath={IconPath} />;
                    },
                    tabBarActiveTintColor: '#0059ed',
                    tabBarInactiveTintColor: 'white',
                    tabBarStyle:{
                        backgroundColor: '#5EA1E9',
                        paddingBottom: 13,
                        paddingTop: 2,
                        height: responsiveHeight(11),
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,

                    },
                    tabBarLabelStyle: {
                        marginBottom: 3,
                        fontSize: responsiveFontSize(1.6),
                        fontWeight: "bold"
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                {/* TODO: Find a way to make 'Citizen Science' fit */}
                <Tab.Screen name="Science" component={CitizenScienceScreen} />
                <Tab.Screen name="Calendar" component={CalendarScreen} />
                <Tab.Screen name="Resource" component={ResourceScreen} />
                <Tab.Screen name="Map" component={MapScreen} />
            </Tab.Navigator>
        </View>
    );
};

export default NavigationBar;