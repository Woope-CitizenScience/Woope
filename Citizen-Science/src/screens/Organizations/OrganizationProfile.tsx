/*
    This screen shows the profile of the organization selected
*/

import React, {useState,useEffect, useContext} from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import OrganizationCard from '../../components/OrganizationCard';
import EventCard from '../../components/EventCard';
import CreateResource from '../../components/CreateResource';
import { Resource } from '../../api/types';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { getResourceById } from '../../api/resources';
import { AuthContext } from '../../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import {AccessToken} from "../../util/token";


export const OrganizationProfile = ({route}) => {
    const { userToken } = useContext(AuthContext);
    const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
    const userId = decodedToken ? decodedToken.user_id : NaN;
    const navigation = useNavigation<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [resourceData, setResourceData] = useState<Resource[]>([]);
    
        //"refreshes page" when focused and when a resource is added
        useFocusEffect(
                    React.useCallback(() => {
                        // grabs featured organizations, if any exist
                        fetchResources();
                    },[isModalVisible])  
                );
        //gets all resources specific to the organization
        const fetchResources = async () => {
            try {
                const resourceList = await getResourceById(route.params.org_id);
                setResourceData(resourceList);
            } catch (error) {
                console.log(error);
            }
        }
    return(
        <SafeAreaView style = {styles.container}>
            <ScrollView>
                {/* Container for organization card */}
                <View>
                    <OrganizationCard org_id={route.params.org_id} user_id = {userId}/>
                </View>
                {/* Container for upcoming events */}
                {/* <View>
                    <View style={styles.upcomingEvents}>
                        <Text style={styles.title}>Upcoming Events</Text>
                    </View>
                    <View>
                        
                    </View>
                </View> */}
                {/* Container for resources */}
                <View>
                    <View style={styles.upcomingEvents}>
                        <Text style={styles.title}>Resources</Text>
                        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                            <Octicons style={styles.addIcon} name='diff-added' size={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* List of all resources */}
                <FlatList
                data={resourceData}
                scrollEnabled={false}
                keyExtractor={(item) => item.resource_id} 
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("ResourceProfile",{
                        resource_id: item.resource_id,
                        org_id: item.org_id,
                    })}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}/>
                {/* Create resource functionality */}
                <CreateResource org_id={route.params.org_id} isVisible = {isModalVisible} onClose={() => 
                    {
                        setIsModalVisible(false)
                    }
                }/>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    addIcon: {

    },
    scrollview: {
        flex: 1,
    },
    container: {
        flex: 1,
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
        justifyContent: 'space-between',
        flexDirection:"row",
        marginHorizontal:20,
        marginBottom: 5,
        padding: 10,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    
    
});
export default OrganizationProfile