/*
    This component shows the organization name, category, banner image, tagline, and full description in a contained card
    when given those parameters
    There is also funcitonality to follow the organization and navigate to see all their posts and events
    
*/
//TODO: FIX follow button jitter when toggled
import React, { useState,useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, FlatList, SafeAreaView } from "react-native";
import { Organization } from "../api/types";
import {getOrganizationById, followOrganization, checkFollowed, unfollow} from "../api/organizations";
import UpdateOrganizationModal from "../components/UpdateOrganizationModal";
import { useNavigation } from "@react-navigation/native";
interface OrganizationProps {
    org_id: number;
    user_id: number;
}
//Component to display organization information on their resource page
const OrganizationCard: React.FC<OrganizationProps> = ({org_id, user_id})=> {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState<Organization[]>([]);
    const [org, setOrg] = useState<OrganizationProps[]>();
    const [isFollowed, setIsFollowed] = useState<boolean>();
    const navigation = useNavigation<any>();
    
    const fetchInfo = async () => {
        try {
            const organizationList = await getOrganizationById(org_id);
            setData(organizationList);
        } catch (error) {
            console.log(error);
        }
    }
    const followedStatus = async (org_id: number, user_id: number) => {
        try {
            let response = await checkFollowed(user_id, org_id);
            setOrg(response);
            if(org[0].org_id !== undefined){
                setIsFollowed(true);
            }else{
                setIsFollowed(false);
            }
        } catch (error) {
            setIsFollowed(false);
        }
        
        
    } 
    useEffect(() => {
        fetchInfo();
        followedStatus(org_id, user_id);
        console.log(1);
    },[isModalVisible,isFollowed])
    return(
        // Container
        <SafeAreaView style={styles.container}> 
            <FlatList
            data={data}
            keyExtractor={(item) => item.org_id}
            scrollEnabled={false}
            renderItem={({item}) =>(
                <View style={styles.cardContainer}>
                    {/*Organization Name, Category, Follow Button */}
                    <View style ={styles.headerContainer}>
                        <View>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.category}></Text>
                        </View>
                        {isFollowed == false && <TouchableOpacity style={styles.follow} onPress={() => {
                            followOrganization(user_id,item.org_id)
                            setIsFollowed(true);
                            }}>
                            <Text>Follow</Text>
                        </TouchableOpacity>}
                        {isFollowed == true && <TouchableOpacity style={styles.follow} onPress={() => {
                            unfollow(user_id,item.org_id)
                            setIsFollowed(false);
                            }}>
                            <Text>Unfollow</Text>
                        </TouchableOpacity>}
                    </View>
                    {/*Organization Banner Image */}
                    <View>
                        <Image style={styles.imageStyle} source={require('../../assets/adaptive-icon.png')}/>
                    </View>
                    {/* Short Tagline */}
                    <View>
                        <Text style = {styles.tagline}>{item.tagline}</Text>
                    </View>
                    {/* Full Description */}
                    <View>
                        <Text style = {styles.description}>{item.text_description}</Text>
                    </View>
                    {/* Container for Events and Posts Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.postButton}>
                            <Text>View Posts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.eventButton} onPress={() => navigation.navigate("EventHome", {
                            org_id: item.org_id
                        })}>
                            <Text>View Events</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={() => setIsModalVisible(true)}
                        >
                            <Text>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <UpdateOrganizationModal
                    isVisible = {isModalVisible} 
                    onClose={() => {
                        setIsModalVisible(false);
                        fetchInfo();
                    }} 
                    name={item.name}/>
                </View>
            )}/>
    </SafeAreaView>
    );
};
const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
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