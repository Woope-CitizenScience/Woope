import React from 'react';
import {TouchableOpacity, ViewStyle, AccessibilityRole } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackButtonProps } from "../types";

// Reusable back control: tries goBack(), then previous-route inference, then falls back to main nav.
const BackButton: React.FC<BackButtonProps> = ({ position }) => {
    const navigation = useNavigation<any>();

    const backButtonStyle: ViewStyle = {
        position: 'absolute',
        top: responsiveHeight(position.top),
        left: responsiveWidth(position.left),
        zIndex: 1000,
    padding: responsiveWidth(0.9),
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5EA1E9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 5,
    };

    const handlePress = () => {
        try {
            if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
                navigation.goBack();
                return;
            }

            // try to infer previous route from navigation state
            if (navigation && typeof (navigation as any).getState === 'function') {
                try {
                    const state = (navigation as any).getState();
                    if (state && Array.isArray(state.routes) && state.routes.length >= 2) {
                        const prevRoute = state.routes[state.routes.length - 2];
                        if (prevRoute && prevRoute.name) {
                            navigation.navigate(prevRoute.name, prevRoute.params);
                            return;
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            // final fallback
            if (navigation && typeof navigation.navigate === 'function') {
                navigation.navigate('NavigationBar');
            }
        } catch (err) {
            console.error(err);
            if (navigation && typeof navigation.navigate === 'function') navigation.navigate('NavigationBar');
        }
    };

    return (
        <TouchableOpacity
            accessible={true}
            accessibilityRole={'button' as AccessibilityRole}
            accessibilityLabel={'Back'}
            hitSlop={{ top: 16, left: 16, right: 16, bottom: 16 }}
            style={backButtonStyle}
            onPress={handlePress}
        >
            <Icon name="arrow-back" size={responsiveWidth(4)} color="#fff" />
        </TouchableOpacity>
    );
};

export default BackButton;
