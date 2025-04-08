/*
    This screen shows the organizations followed by the user in a list
*/

import React, {useState, useEffect, useContext}from 'react';
import {Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Organization } from '../../api/types';
import { getOrganizationsFollowed } from '../../api/organizations';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../util/token';

export const OrganizationFollowed = () => {
    const navigation = useNavigation<any>();
    const { userToken, setUserToken } = useContext(AuthContext);
    const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
    const userId = decodedToken ? decodedToken.user_id : NaN;
    const [data,setData] = useState<Organization[]>([]);
    useEffect(() => {
		fetchOrganizations();
	}, []);
    const fetchOrganizations = async () => {
        try {
            const organizationList = await getOrganizationsFollowed(userId);
            setData(organizationList);
        } catch (error) {
            console.log('Failed to retrieve organizations', error);
        }
    };
    if (data[0] !== undefined){
        return(
            <SafeAreaView style={styles.container}>
            {/*using a flatlist to display organizations, keyextractor to use the org_id as key*/}
            <FlatList
                data={data}
                numColumns={1}
                keyExtractor={item => item.org_id}
                renderItem={({item}) => (
                <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("OrganizationProfile", {
                    org_id: item.org_id,
                    name: item.name
                })}>
                    <Text style={styles.title}>{item.name}</Text>
                </TouchableOpacity>
                )}
            />
            </SafeAreaView>
            );
    }
    else{
        return(
            <SafeAreaView style = {styles.errorContainer}>
                            <Text style={styles.error}>No groups followed</Text>
            </SafeAreaView>
        );
    }
    
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
    errorContainer: {
        flex: 1, 
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    error: {
        alignSelf: "center",
        fontSize: 20,
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
export default OrganizationFollowed