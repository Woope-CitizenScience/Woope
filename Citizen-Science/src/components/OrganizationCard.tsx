/*
    This component shows the organization name, category, banner image, tagline, and full description in a contained card
    when given those parameters
    There is also funcitonality to follow the organization and navigate to see all their posts and events
    
*/
import React, { useState,useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, TextInput } from "react-native";
import { updateOrganization } from "../api/organizations";
interface OrganizationProps {
    name: string;
    tagline: string;
    text_description: string;
}
interface OrganizationInfo {
    orgName: string;
    orgTagline: string;
    orgDescription: string;
}
interface Errors {
	name?: string;
	tagline?: string;
    textDescription?: string;
}

//Component to display organization information on their resource page
const OrganizationCard: React.FC<OrganizationProps> = ({name, tagline, text_description})=> {
    const [textColor,setTextColor] = useState("black");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [editable, setEditable] = useState(false);
    const [editText, setEditText] = useState("Edit");
    const [errors, setErrors] = useState<Errors>({});
    const [orgInfo, setOrgInfo] = useState<OrganizationInfo>({
        orgName: name,
        orgTagline: tagline,
        orgDescription: text_description,
        });
    const [newInfo, setNewInfo] = useState<OrganizationInfo>({
        orgName: name,
        orgTagline: tagline,
        orgDescription: text_description,
    })
    const showPopup = (messages: string[]) => {
        const formattedMessages = messages.map(message => `\u2022 ${message}`).join('\n');
        setPopupMessage(formattedMessages);
        setIsPopupVisible(true);
    };
    const handleInputChange = (field: keyof OrganizationInfo, value: string) => {
		setNewInfo(prevState => ({ ...prevState, [field]: value }));
	};
    const handleSavePress = async () => {
            try {
                const response = await updateOrganization(newInfo.orgName,newInfo.orgTagline,newInfo.orgDescription);
                setOrgInfo(newInfo);
                setEditable(false);
                setTextColor("black");
                setEditText("Edit")
            } catch (error) {
                console.log('Update failed', error);
            }
        };
    return(
        // Container
        <View style={styles.cardContainer}>
            {/*Organization Name, Category, Follow Button */}
            <View style ={styles.headerContainer}>
                <View>
                    <TextInput style={styles.title} editable={false}>{orgInfo.orgName}</TextInput>
                    <Text style={styles.category}></Text>
                </View>
                <TouchableOpacity style={styles.follow}>
                    <Text>Follow</Text>
                </TouchableOpacity>
            </View>
            {/*Organization Banner Image */}
            <View>
                <Image style={styles.imageStyle}source={require('../../assets/adaptive-icon.png')}/>
            </View>
            {/* Short Tagline */}
            <View>
                <TextInput 
                style={{'fontSize':14, 'fontWeight': '600', 'color': textColor}} 
                editable = {editable}
                onChangeText = {(value) => handleInputChange('orgTagline',value)}
                >
                    {orgInfo.orgTagline}
                </TextInput>
            </View>
            {/* Full Description */}
            <View>
                <TextInput 
                style={{'fontSize':14, 'fontWeight': '600', 'color': textColor}} 
                editable = {editable}
                onChangeText = {(value) => handleInputChange('orgDescription',value)}
                multiline = {true}
                >{orgInfo.orgDescription}</TextInput>
            </View>
            {/* Container for Events and Posts Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.postButton}>
                    <Text>View Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.eventButton}>
                    <Text>View Events</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => {
                    if(editable === false){
                        setEditable(true);
                        setTextColor("red");
                        setEditText("Save")
                    }
                    else{
                        handleSavePress();
                    }
                }}
                >
                        <Text>{editText}</Text>
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
    follow:{
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        width: 70,
        padding:5,
        borderRadius: 10,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 9,

    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent: 'space-evenly',
        gap: 5,
        padding: 10,
    },
    eventButton:{
       
        padding:10,
        borderRadius:10,
        backgroundColor: 'white',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 9,
    },
    editButton: {
        padding:10,
        borderRadius:10,
        backgroundColor: 'lightyellow',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 9,
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

export default OrganizationCard;