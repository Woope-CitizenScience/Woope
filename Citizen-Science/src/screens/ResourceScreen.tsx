import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const ResourceScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Pressable onPress={() => navigation.navigate("ResourceFollowed")}> 
                    <View style = {styles.directoryButton}> 
                        <Text style={styles.title}> Followed Groups </Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("ResourceSearch")}>
                    <View style = {styles.directoryButton}> 
                        <Text style={styles.title}> Search Directory </Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("ResourceCategory")}>
                    <View style = {styles.directoryButton}> 
                        <Text style={styles.title}> Search By Category </Text>
                    </View>
                </Pressable>

                <View>
                    <Text style={styles.title}> Featured Groups </Text>
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
    scrollView: {
        paddingHorizontal: 16,
        backgroundColor: "white",
    },
    title: {
        fontSize: 28,
        color: '#232f46',
    },
    directoryButton: {
        borderRadius: 16,
        borderWidth: 2,
        padding: 24,
        margin: 16,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
    },
});
export default ResourceScreen;