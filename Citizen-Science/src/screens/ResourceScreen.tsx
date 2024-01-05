import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResourceScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Resource Screen</Text>
        </View>
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
export default ResourceScreen;