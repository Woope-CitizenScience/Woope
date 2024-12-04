import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeaturedOrganizationCard from '../components/FeaturedOrganizationCard';
export const ResourceScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Followed Groups Button */}
                <Pressable onPress={() => navigation.navigate("ResourceFollowed")}> 
                    <View style = {styles.directoryButton}> 
                        <Text style={styles.title}> Followed Groups </Text>
                    </View>
                </Pressable>
                {/* Search Directory Button */}
                <Pressable onPress={() => navigation.navigate("ResourceSearch")}>
                    <View style = {styles.directoryButton}> 
                        <Text style={styles.title}> Search Directory </Text>
                    </View>
                </Pressable>
                {/* Search By Category Button */}
                <Pressable onPress={() => navigation.navigate("ResourceCategory")}>
                    <View style = {styles.directoryButton}> 
                        <Text style={styles.title}> Search By Category </Text>
                    </View>
                </Pressable>
                {/* Container for Featured Group title*/}
                <View style = {styles.featuredContainer}>
                    <Text style={styles.title}> Featured Groups </Text>
                </View>
                {/* Container for Featured Group Carousel */}
                <View style = {styles.carouselContainer}>
                    <FeaturedOrganizationCard/>
                </View>
                {/* Container for scroll dots */}
                <View>
                    <Text></Text>
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
        backgroundColor: "white",
    },
    title: {
        fontSize: 28,
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
    featuredContainer: {
        alignSelf:'center',
        paddingTop: 20,
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderColor: 'lightgrey',
    },
    carouselContainer:{
        
    }
});
export default ResourceScreen;