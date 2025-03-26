/* 

    This screen displays all the organization categories in a list,
    clicking on the category takes you to another screen that displays all organizations with
    that specific category

*/
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Pressable, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Category } from '../../api/types';
import { getAllCategories } from '../../api/organizations';
export const OrganizationCategory = () => {
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
    if (data[0] !== undefined){
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
                    <TouchableOpacity style={styles.postBox} onPress={() => navigation.navigate("SpecificCategory",{category: item.category_id})}> 
                        <View style = {styles.postBoxInner}>
                            <Text style={styles.postBoxText}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        );
    }
    else{
        return(
            <SafeAreaView style = {styles.errorContainer}>
                <Text style={styles.error}>No categories exist</Text>
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
    scrollView: {
        paddingHorizontal: 16,
        backgroundColor: "white",
    },
    title: {
        fontSize: 30,
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
    postBox: {
        backgroundColor: "#B4D7EE",
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        marginHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E7F3FD",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        marginTop: 6,
    },
    postBoxInner: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "transparent",
        alignSelf: "stretch",
        borderBottomWidth: 1,
        borderBottomColor: "#D1E3FA",
    },
    postBoxText: {
        fontSize: 16,
        color: "#333",
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        overflow: "hidden",
        textAlign: "center",
    }
});
export default OrganizationCategory