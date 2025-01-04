/*
    This screen will allow the user to manage organizations
*/
import React from "react";
import { View, Modal,TouchableOpacity,ScrollView, Pressable, Text, StyleSheet, StatusBar} from "react-native";
import { useNavigation } from "@react-navigation/native";
export const ManageResources = () => {
    const navigation = useNavigation<any>();
    return( 
        <ScrollView>
            <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("CreateOrganization")}>
                <Text style={styles.title}>Create Organization</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.directoryButton}>
                <Text style={styles.title}>Delete Organization</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.directoryButton}>
                <Text style={styles.title}>Feature Organization</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.directoryButton}>
                <Text style={styles.title}>Edit Organization</Text>
            </TouchableOpacity>
        </ScrollView>  
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "white",
    },
    title: {
        fontSize: 20,
        color: '#232f46',
    },
    directoryButton: {
        borderRadius: 10,
        padding: 14,
        marginVertical: 7,
        marginHorizontal: 15,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 9,
    },
});
export default ManageResources;