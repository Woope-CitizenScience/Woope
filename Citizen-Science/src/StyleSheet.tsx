// Refer to the following StyleSheet Documentation:
// https://reactnative.dev/docs/stylesheet

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
    title: {
            fontSize: 45,
            fontWeight: 'bold',
            color: '#fff',
    },
    subTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        position: 'absolute',
        top: -135,
        left: 50,
        right: 50,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    backgroundColor: {
        flex: 1,
        backgroundColor: '#3a9bdc',
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default styles;
