import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Organization } from '../api/types';
import OrganizationCard from '../components/OrganizationCard';
import EventCard from '../components/EventCard';

export const OrganizationProfile = ({route}) => {
    const navigation = useNavigation<any>();
    return(
        <SafeAreaView>
            <ScrollView>
                {/* Container for organization card */}
                <View>
                    <OrganizationCard name = {route.params.name} tagline = {route.params.tagline} text_description = {route.params.text_description}/>
                </View>
                {/* Container for upcoming events */}
                <View>
                    <View style={styles.upcomingEvents}>
                        <Text style={styles.title}>Upcoming Events</Text>
                    </View>
                    <View>
                        <EventCard/>
                    </View>
                </View>
                {/* Container for resources */}
                <View>
                    <View style={styles.upcomingEvents}>
                        <Text style={styles.title}>Resources</Text>
                    </View>
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("ResourceProfile")}>
                        <Text>Sample</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("ResourceProfile")}>
                        <Text>Sample</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("ResourceProfile")}>
                        <Text>Sample</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("ResourceProfile")}>
                        <Text>Sample</Text>
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
export default OrganizationProfile