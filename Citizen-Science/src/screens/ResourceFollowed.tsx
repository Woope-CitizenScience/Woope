import React, {useState, useEffect, useContext}from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Organization } from '../api/types';
import { getOrganizationsFollowed } from '../api/organizations';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../util/token';

export const ResourceFollowed = () => {
    const navigation = useNavigation();
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
    return(
        <SafeAreaView style={styles.container}>
        {/*using a flatlist to display organizations, keyextractor to use the org_id as key*/}
        <FlatList
         data={data}
         numColumns={1}
         keyExtractor={item => item.org_id}
         renderItem={({item}) => (
            <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("ResourceProfile")}>
                <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
            )}
        />
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
        borderWidth: 2,
        padding: 14,
        margin: 11,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
    },
});
export default ResourceFollowed