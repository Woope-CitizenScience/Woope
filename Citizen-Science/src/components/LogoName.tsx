import {SafeAreaView, Text, StyleSheet, Dimensions} from "react-native";
import styles from "../StyleSheet";
import React from "react";
import {LogoNameProps} from "../types";

const { height, width } = Dimensions.get('window');
const LogoName: React.FC<LogoNameProps> = ({
                                               position,
                                               color
                                            }) => {
    return(
        <SafeAreaView style={[
            logoStyles.container,
            logoStyles[position]]}>
            <Text style={[
                styles.title,
                {color: color},
                {fontSize: 20}]}>
                WOOPE
            </Text>
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
        position: 'absolute',
        left: width * 0.01,
        top: height * 0.01
    },
    bottomRight: {
        position: 'absolute',
        left: width * 0.75,
        top: height * 0.95
    }
});
