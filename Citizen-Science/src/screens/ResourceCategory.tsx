import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Pressable, SafeAreaView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const ResourceCategory = () => {
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <TouchableOpacity onPress = {() => navigation.navigate("ResourceSpecificCategory", {category: "Mutual Aid"})}>
                    <View style={styles.directoryButton}>
                        <Text style={styles.title}>Mutual Aid</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ResourceSpecificCategory", {category: "Health"})}>
                    <View style={styles.directoryButton}>
                        <Text style={styles.title}>Health</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ResourceSpecificCategory", {category: "Food"})}>
                    <View style={styles.directoryButton}>
                        <Text style={styles.title}>Food</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ResourceSpecificCategory", {category: "Education"})}>
                    <View style={styles.directoryButton}>
                        <Text style={styles.title}>Education</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ResourceSpecificCategory", {category: "Social"})}>
                    <View style={styles.directoryButton}>
                        <Text style={styles.title}>Social</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ResourceSpecificCategory", {category: "Activism"})}>
                    <View style={styles.directoryButton}>
                        <Text style={styles.title}>Activism</Text>
                    </View>
                </TouchableOpacity>
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
    scrollView: {
        paddingHorizontal: 16,
        backgroundColor: "white",
    },
    title: {
        fontSize: 30,
        color: '#232f46',
    },
    directoryButton: {
        borderRadius: 16,
        padding: 24,
        margin: 16,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 9,
    },
});
export default ResourceCategory