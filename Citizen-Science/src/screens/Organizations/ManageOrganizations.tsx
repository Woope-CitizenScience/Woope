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
                <View>
                    <TouchableOpacity style={styles.postBox} onPress={() => navigation.navigate("CreateOrganization")}>
                        <View style = {styles.postBoxInner}>
                            <Text style={styles.postBoxText}>Create</Text>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.directoryButtonTop} onPress={() => navigation.navigate("CreateCategory")}>
                        <Text style={styles.title}>Categorize</Text>
                    </TouchableOpacity> */}
                </View>
                <View>
                    <TouchableOpacity style={styles.postBox} onPress={() => navigation.navigate("FeatureOrganization")}>
                        <View style = {styles.postBoxInner}>
                            <Text style={styles.postBoxText}>Feature</Text>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("CreateOrganization")}>
                        <Text style={styles.title}>Edit</Text>
                    </TouchableOpacity> */}
                </View>
                <TouchableOpacity style = {styles.postBox} onPress={() => setDeleteModal(true)}>
                    <View style = {styles.postBoxInner}>
                        <Text style ={styles.postBoxText}> Delete </Text>
                    </View>
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
    },
    postBox: {
        backgroundColor: "#B4D7EE",
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#E7F3FD",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        marginTop: 6,
    },
    postBoxInner: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "transparent",
        alignSelf: "stretch",
        borderBottomWidth: 1,
        borderBottomColor: "#D1E3FA",
    },
    postBoxText: {
        fontSize: 16,
        color: "#333",
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        overflow: "hidden",
        textAlign: "center",
    }
});
export default ManageOrganizations;