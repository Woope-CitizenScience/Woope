// Refer to the following StyleSheet Documentation:
// https://reactnative.dev/docs/stylesheet

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {responsiveFontSize} from "react-native-responsive-dimensions";

const styles = StyleSheet.create({
    title: {
            fontSize: 45,
            fontWeight: 'bold',
            color: '#fff',
    },
    subtitle: {
        fontSize: 40,
        fontWeight: 'normal',
        color: '#fff',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
    backgroundColor: {
        flex: 1,
        backgroundColor: '#5EA1E9',
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default styles;
