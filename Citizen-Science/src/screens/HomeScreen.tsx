import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SideMenu from '../components/SideMenu';
import WelcomeBanner from '../components/WelcomeBanner';

const HomeScreen = () => {
    return (
        
		<SideMenu/>
            
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
        color: '#232f46',
    },
});
export default HomeScreen;