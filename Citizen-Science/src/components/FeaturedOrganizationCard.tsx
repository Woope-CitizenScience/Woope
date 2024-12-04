import { title } from "process";
import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

//Component to display organization information on their resource page
const FeaturedOrganizationCard = () => {
    return(
        // Container
        <View style={styles.cardContainer}>
            {/*Organization Name, Category, Follow Button */}
            <View style ={styles.headerContainer}>
                <View>
                    <Text style={styles.title}>Organization Name</Text>
                    <Text style={styles.category}>Category</Text>
                </View>
            </View>
            {/*Organization Banner Image */}
            <View>
                <Image style={styles.imageStyle}source={require('../../assets/adaptive-icon.png')}/>
            </View>
            {/* Short Tagline */}
            <View>
                <Text style={styles.tagline}>Short Tagline</Text>
            </View>
            {/* Full Description */}
            <View>
                <Text style={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                    , quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                     nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                     deserunt mollit anim id est laborum.</Text>
            </View>
            {/* Container for Events and Posts Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.postButton}>
                    <Text>Visit Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
    cardContainer: { 
        width: deviceWidth - 20,
        backgroundColor: 'lightblue',
        margin: 10,
        borderRadius: 20,
        padding: 13,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 9,
    },
    headerContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    imageStyle: {
        height: 150,
        width: deviceWidth - 50,
        opacity:.9,
        alignContent: 'center',
        alignSelf: 'center',
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    tagline:{
        fontSize: 14,
        fontWeight: '600',
    },
    description:{
        fontSize: 10,
        fontWeight: '300',
    },
    category:{
        fontSize:14,
        fontWeight: '200',
    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent: 'space-evenly',
        gap: 5,
        padding: 10,
    },
    postButton:{
        
        padding:10,
        borderRadius:10,
        backgroundColor:'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 9,
        
    }
    

});

export default FeaturedOrganizationCard;