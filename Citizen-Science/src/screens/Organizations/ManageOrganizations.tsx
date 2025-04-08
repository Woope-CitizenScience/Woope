/*
    This screen will allow the user to manage organizations
*/
import React, {useState}from "react";
import { View, Modal,TouchableOpacity,ScrollView, Pressable, Text, StyleSheet, StatusBar, SafeAreaView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DeleteOrganization from "../../components/DeleteOrganization";
export const ManageOrganizations = () => {
    const navigation = useNavigation<any>();
    const [deleteModal, setDeleteModal] = useState(false);
    return( 
        <SafeAreaView style={styles.container}>
            
            <View style = {styles.column}>
                <View style = {styles.row}>
                    <TouchableOpacity style={styles.directoryButtonTop} onPress={() => navigation.navigate("CreateOrganization")}>
                        <Text style={styles.title}>Create</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.directoryButtonTop} onPress={() => navigation.navigate("CreateCategory")}>
                        <Text style={styles.title}>Categorize</Text>
                    </TouchableOpacity> */}
                </View>
                <View style = {styles.row}>
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("FeatureOrganization")}>
                        <Text style={styles.title}>Feature</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("CreateOrganization")}>
                        <Text style={styles.title}>Edit</Text>
                    </TouchableOpacity> */}
                </View>
                <TouchableOpacity style = {styles.deleteContainer} onPress={() => setDeleteModal(true)}>
                        <Text style ={styles.delete}> Delete </Text>
                </TouchableOpacity>
                <DeleteOrganization isVisible={deleteModal} onClose={() => setDeleteModal(false)} />
            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    column: {
        flex: 1,
        gap: 40,
        padding: 20,
    },
    row: {
        flex: 2,
        gap: 30,
        flexDirection: "row",
    },
    title: {
        fontSize: 28,
        fontWeight: "400",
        color: 'black',
    }, 
    directoryButtonTop: {
        flex: 1,
        borderRadius: 10,
        height: "55%",
        width: 500,
        alignSelf: "flex-end",
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
    directoryButton: {
        flex: 1,
        borderRadius: 10,
        height: "55%",
        width: 500,
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
    deleteContainer: {
        flex: 1,
        alignSelf: "center",
    },
    delete: {
        alignSelf: "center",
        color: "red",
        fontSize: 28,
        fontWeight: "bold"
    }
});
export default ManageOrganizations;