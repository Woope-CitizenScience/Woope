import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { mdiHome, mdiTestTube, mdiCalendar, mdiBookshelf, mdiMapMarker } from '@mdi/js';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import {MapHome} from '../screens/Map/MapHomeScreen';
import ResourceScreen from '../screens/ResourceScreen';
import CitizenScienceScreen from '../screens/CitizenScience';

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
                            case 'Citizen Science':
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
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Citizen Science" component={CitizenScienceScreen} />
                <Tab.Screen name="Calendar" component={CalendarScreen} />
                <Tab.Screen name="Resource" component={ResourceScreen} />
                <Tab.Screen name="Map" component={MapHome} />
            </Tab.Navigator>
        </View>
    );
};

export default NavigationBar;