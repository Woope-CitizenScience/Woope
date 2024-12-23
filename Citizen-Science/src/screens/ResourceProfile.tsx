import React from "react";
import { Text,View, SafeAreaView,ScrollView,StyleSheet,Image,StatusBar, TouchableOpacity} from "react-native";
import ResourceCard from "../components/ResourceCard";
export const ResourceProfile = () => {
    return(
        <SafeAreaView>
            <ScrollView>
                {/* Resource Card */}
                <ResourceCard/>
                {/* Resources Container */}
                <View>
                    {/* Divider */}
                    <View></View>
                    <TouchableOpacity style={styles.directoryButton}>
                        <Text>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.directoryButton}>
                        <Text>Documents</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.directoryButton}>
                        <Text>Texts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.directoryButton}>
                        <Text>Flyers</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
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
    upcomingEvents: {
        alignItems: 'center', 
        marginHorizontal:20,
        marginBottom: 5,
        padding: 10,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    }, 
});
export default ResourceProfile;
