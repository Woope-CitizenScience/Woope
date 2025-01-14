import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createPinNew } from '../api/pins';
let newDate = new Date(1);
let num = 10;
const CitizenScreen = () => {
    return (
        <View style={styles.container}>
            <Pressable onPress={() => createPinNew(num,"a","b", newDate, "c",1,2)}>
                    <View> 
                        <Text > Search Directory </Text>
                    </View>
            </Pressable>
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
export default CitizenScreen;