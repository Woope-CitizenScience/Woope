/*
    This screen displays all the organizations that have the category that is passed to it by 'route'
    Organizations can fall under multiple categories, this navigates to the specific profile of the organization that is selected
*/

import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, FlatList, View, Button, StatusBar, TouchableOpacity } from 'react-native';
import { getOrganizationsByCategoryId} from '../../api/organizations';
import { Organization} from '../../api/types';
import { useNavigation } from '@react-navigation/native';
export const SpecificCategory = ({route}) => {
    // using api to retrieve the specified organizations
    const navigation = useNavigation<any>();
    const [data,setData] = useState<Organization[]>([]);
    useEffect(() => {
		fetchOrganizations();
	}, []);
    const fetchOrganizations = async () => {
        try {
            let category_id = route.params.category;
            const organizationList = await getOrganizationsByCategoryId(category_id);
            setData(organizationList);
        } catch (error) {
            console.log('Failed to retrieve organizations', error);
        }
    };
    // displaying organizations using a flatlist, passing the organization data to the next screen when clicked
    return(
        <SafeAreaView style={styles.container}>
        {/*using a flatlist to display organizations, keyextractor to use the org_id as key*/}
        <FlatList
            data={data}
            numColumns={1}
            keyExtractor={item => item.org_id}
            renderItem={({item}) => (
            <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("OrganizationProfile",{
                name: item.name,
                tagline: item.tagline,
                text_description: item.text_description,
                })}>
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
export default SpecificCategory