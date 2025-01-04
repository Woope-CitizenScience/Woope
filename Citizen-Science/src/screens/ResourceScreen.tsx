/*

    This screen is the main page for the resources tab, it redirects to ResourceSearch, Resource Followed, ResourceCategory
    It also features a carousel of featured organizations which when clicked lead directly to their profiles

*/
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFeaturedOrganizations } from '../api/organizations';
import { Organization } from '../api/types';
import FeaturedOrganizationCard from '../components/FeaturedOrganizationCard';
export const ResourceScreen = () => {
    const navigation = useNavigation<any>();
    // fetching featured organizations
    const [data,setData] = useState<Organization[]>([]);
        useEffect(() => {
            fetchFeaturedOrganizations();
        }, []);
        const fetchFeaturedOrganizations = async () => {
            try {
                const organizationList = await getFeaturedOrganizations();
                setData(organizationList);
            } catch (error) {
                console.log('Failed to retrieve organizations', error);
            }
        };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Followed Groups Button */}
                <Pressable onPress={() => navigation.navigate("ManageResources")}> 
                    <View style = {styles.directoryButton}> 
                        <Text style={styles.title}> Manage Groups </Text>
                    </View>
                </Pressable>
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
                <FlatList
                data={data}
                numColumns={1}
                horizontal={true}
                keyExtractor={item => item.org_id}
                renderItem={({item})=>(
                    <FeaturedOrganizationCard name={item.name} tagline={item.tagline} text_description={item.text_description}/>
                )}
                />
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