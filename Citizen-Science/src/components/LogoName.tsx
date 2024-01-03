import {SafeAreaView, Text, StyleSheet } from "react-native";
import styles from "../StyleSheet";
import React from "react";
import {LogoNameProps} from "../types";
const LogoName: React.FC<LogoNameProps> = ({position, color}) => {
    return(
        <SafeAreaView style={[logoStyles.container, logoStyles[position]]}>
            <Text style={[styles.title, {color: color}, {fontSize: 20}]}>WOOPE</Text>
        </SafeAreaView>

    )
}
export default LogoName;

const logoStyles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        margin: 10,
    },
    topLeft: {
        alignSelf: 'flex-start',
        marginTop: 0,
        marginLeft: 0,
    },
    bottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0
    }

})