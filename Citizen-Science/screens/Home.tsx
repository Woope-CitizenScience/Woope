import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {useNavigation} from "@react-navigation/native";
import {auth} from "../firebase";
const Home = () => {
    const navigator = useNavigation();

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigator.navigate("Login");
        }).catch((error) => {
            console.log(error);
        });
    }

  return (
    <View style={styles.container}>
        <Text>Email: {auth.currentUser?.email}</Text>
    <TouchableOpacity
        onPress={handleLogout}
        style={styles.button}
    >
        <Text style={styles.buttonText}>Sign out</Text>
    </TouchableOpacity>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 20,
    },
    button: {
        backgroundColor: "blue",
        padding: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});