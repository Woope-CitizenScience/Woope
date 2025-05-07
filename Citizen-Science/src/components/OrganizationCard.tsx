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
import { getOrganizationById, followOrganization, unfollowOrganization, following} from "../api/organizations";
import UpdateOrganizationModal from "../components/UpdateOrganizationModal";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

interface OrganizationProps {
    org_id: number;
    user_id: number;
}
interface FollowStatus {
    case: number;
}
//Component to display organization information on their resource page
const OrganizationCard: React.FC<OrganizationProps> = ({org_id, user_id})=> {
    const navigation = useNavigation<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState<Organization[]>(
        [{org_id: 0, name: "", text_description: "", tagline: "", image_path: ""}]
    );
    const [isFollowed, setIsFollowed] = useState<number>();
    const [value, setValue] = useState<FollowStatus>();
    
    useEffect(() => {
        fetchInfo().then((value) => {
            checkFollowed()
        })
    }, [isModalVisible, isFollowed])

    // getting the information of the organization
    const fetchInfo = async () => {
        try {
            const organizationList = await getOrganizationById(org_id);
            setData(organizationList);
        } catch (error) {
            console.log(error);
        }
    }
    const checkFollowed = async () => {
        try {
            const response = await following(user_id,org_id);
            setIsFollowed(response.case)
        } catch (error) {
            console.log("Error Checking follow status" + error)
        }
    }
    const pressFollow = () => {
        follow();
        setIsFollowed(1);
    }
    const pressUnfollow = () => {
        unfollow();
        setIsFollowed(0);
    }
    const follow = async() => {
        try{
            const response = await followOrganization(user_id, org_id);
        }catch (error){
            console.log("Error following organization: " + error);
        }
    }
    const unfollow = async() => {
        try {
            const response = await unfollowOrganization(user_id, org_id);
        } catch (error) {
            console.log("Error unfollowing organization: " + error);
        }
    }

    return(
        // Container
        <SafeAreaView style={styles.container}> 
                <View style={styles.postBox}>
                    {/*Organization Name, Category, Follow Button */}
                    <View style ={styles.headerContainer}>
                        <View>
                            <Text style={styles.title}>{data[0].name}</Text>
                        </View>
                        
                        <View style={styles.edit}>

                            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                <AntDesign name="edit" color="brown" size={30}/>
                            </TouchableOpacity>

                            
                            {(isFollowed == 0) &&
                                <TouchableOpacity style={styles.follow} onPress={() => {
                                    pressFollow();
                                }}>
                                    <Text>Follow</Text>
                                </TouchableOpacity>
                            }

                            {(isFollowed == 1)&&
                            <TouchableOpacity style={styles.follow} onPress={() => {
                                    pressUnfollow();
                                }}>
                                 <Text>Unfollow</Text>
                            </TouchableOpacity> 
                            }
                        </View>
                    </View>
                    {/*Organization Banner Image */}
                    <View>
                       {data[0].image_path && <Image style={styles.imageStyle} source={{uri: process.env.EXPO_PUBLIC_API_URL + '/uploads/' + data[0].image_path}}/> }
                    </View>
                    {/* Short Tagline */}
                    <View>
                        <Text style = {styles.tagline}>{data[0].tagline}</Text>
                    </View>
                    {/* Full Description */}
                    <View>
                        <Text style = {styles.description}>{data[0].text_description}</Text>
                    </View>
                    {/* Container for Events and Posts Button */}
                    <View style={styles.buttonContainer}>
                    
                    {/* <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => {
                        navigation.navigate("OrganizationProfile", { org_id, user_id });
                    }}
                    >
                    <Text>View Posts</Text>

                    </TouchableOpacity> */}
                    
                        <TouchableOpacity style={styles.eventButton} onPress={() => navigation.navigate("EventHome", {
                            org_id: org_id
                        })}>
                            <Text>View Events</Text>
                        </TouchableOpacity>
                    </View>
                    <UpdateOrganizationModal
                    isVisible = {isModalVisible} 
                    onClose={() => {
                        setIsModalVisible(false);
                        fetchInfo();
                    }} 
                    name={data[0].name}
                    org_id={org_id}/>
                </View>
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
        marginTop: 20,
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
    edit: {
        flexDirection: "row",
        gap: 10,
    },
    postButton:{
        marginTop: 20,
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
        
    },
    postBox: {
        backgroundColor: "#B4D7EE",
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 15,
        justifyContent: "center",
        alignSelf: "stretch",
        marginHorizontal: 10,
        marginBottom: 40,
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

export default OrganizationCard;