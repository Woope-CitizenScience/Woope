/* 
    This screen will display ALL organizations in a directory
 */
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, FlatList, StatusBar, TouchableOpacity, View} from 'react-native';
import { getAllOrganizations } from '../../api/organizations';
import { Organization } from '../../api/types';
import { useNavigation } from '@react-navigation/native';

const OrganizationSearch = () => {
    const navigation = useNavigation<any>();
    // Fetching all organizations
    const [data,setData] = useState<Organization[]>([]);
    useEffect(() => {
		fetchOrganizations();
	});
    const fetchOrganizations = async () => {
        try {
            const organizationList = await getAllOrganizations();
            setData(organizationList);
        } catch (error) {
            console.log('Failed to retrieve organizations', error);
        }
    };
    if (data[0] !== undefined){
        return(
            <SafeAreaView style={styles.container}>
                {/*using a flatlist to display organizations, using the org_id as key*/}
                <FlatList
                data={data}
                numColumns={1}
                keyExtractor={item => item.org_id}
                renderItem={({item}) => 
                    (
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("OrganizationProfile",{
                        org_id: item.org_id,
                        name: item.name
                        })}>
                        <Text style={styles.title}>{item.name}</Text>
                    </TouchableOpacity>
                    )}/>
            </SafeAreaView>
        );
    }
    else{
        return(
            <SafeAreaView style = {styles.errorContainer}>
                <Text style={styles.error}>No groups exist</Text>
            </SafeAreaView>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
});

export default OrganizationSearch;