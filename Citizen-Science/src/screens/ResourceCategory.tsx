/* 

    This screen displays all the organization categories in a list,
    clicking on the category takes you to another screen that displays all organizations with
    that specific category

*/
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Pressable, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Category } from '../api/types';
import { getAllCategories } from '../api/organizations';
export const ResourceCategory = () => {
    const navigation = useNavigation<any>();
        // Using api to fetch all categories
        const [data,setData] = useState<Category[]>([]);
        useEffect(() => {
            fetchCategories();
        }, []);
        const fetchCategories = async () => {
            try {
                const categoryList = await getAllCategories();
                setData(categoryList);
            } catch (error) {
                console.log('Failed to retrieve organizations', error);
            }
        };
    
    return(
            <SafeAreaView style={styles.container}>
                {/*
                    using a flatlist to display categories, keyextractor to use the categoy_id as key
                    then passing the category_id that was clicked to next screen
                */}
                <FlatList
                    data={data}
                    numColumns={1}
                    keyExtractor={item => item.category_id}
                    renderItem={({item}) => (
                    <TouchableOpacity style={styles.directoryButton} onPress={() => navigation.navigate("ResourceSpecificCategory",{category: item.category_id})}> 
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
    scrollView: {
        paddingHorizontal: 16,
        backgroundColor: "white",
    },
    title: {
        fontSize: 30,
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
});
export default ResourceCategory