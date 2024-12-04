import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, FlatList, View, Button, StatusBar, TouchableOpacity } from 'react-native';
import { getOrganizationsWithCategory } from '../api/organizations';
import { OrganizationWithCategory} from '../api/types';
import { useNavigation } from '@react-navigation/native';
export const ResourceSpecificCategory = ({route}) => {
    const navigation = useNavigation();
    const [data,setData] = useState<OrganizationWithCategory[]>([]);
    useEffect(() => {
		fetchOrganizations();
	}, []);
    const fetchOrganizations = async () => {
        try {
            let category_name = route.params.category;
            const organizationList = await getOrganizationsWithCategory(category_name);
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
            <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("OrganizationProfile")}>
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
export default ResourceSpecificCategory