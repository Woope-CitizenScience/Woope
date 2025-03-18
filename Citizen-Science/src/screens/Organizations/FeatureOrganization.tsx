/*
    This screen will allow the user to create organization categories
    ?: convert into a modal component instead?
*/
import React, {useState, useEffect} from 'react';
import {ImageBackground, SafeAreaView, Platform, KeyboardAvoidingView, Text, StatusBar, StyleSheet, View, TextInput, TouchableOpacity, Keyboard, FlatList} from "react-native";
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Popup from "../../components/Popup";
import { getFeaturedOrganizations, removeFeature } from '../../api/organizations';
import { Organization } from '../../api/types';
import FeaturedOrganizationCard from '../../components/FeaturedOrganizationCard';
import FeatureModal from '../../components/FeatureModal';
import { MaterialIcons, Octicons, AntDesign,EvilIcons } from '@expo/vector-icons';


type NavigationParam = {
    Login: undefined;
    Signup: undefined;
    NavigationBar: undefined;
};

interface Errors {
	name?: string;
	tagline?: string;
    textDescription?: string;
}

interface OrganizationInfo {
	name: string;
    tagline: string;
    text_description: string;
}

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Signup'>;

export const FeatureOrganization = () => {
    const navigation = useNavigation<NavigationProp>();
    const [featuredCount, setFeaturedCount] = useState(0);
    const [totalFeatured, setTotalFeatured] = useState(5);
	const [userInfo, setUserInfo] = useState<OrganizationInfo>({
		name: '',
		tagline: '',
		text_description: '',
	});
    const [featured, setFeatured] = useState<Organization[]>();
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [isFull, setIsFull] = useState(false);
	const showPopup = (messages: string[]) => {
		const formattedMessages = messages.map(message => `\u2022 ${message}`).join('\n');
		setPopupMessage(formattedMessages);
		setIsPopupVisible(true);
	};
	
    const fetchFeatured = async() => {
        try {
            const response = await getFeaturedOrganizations();
            setFeatured(response);
            setFeaturedCount(Number(featured?.length));
        } catch (error) {
            console.log("Error retrieving featured groups")
        }
    }
    useEffect(() => {
                fetchFeatured();
                checkFull();
            });
            
    const checkFull = () => {
        if(featuredCount == totalFeatured){
            setIsFull(true);
        }
        else{
            setIsFull(false);
        }
    }
    const remove  = async(name: string) => {
        try {
            removeFeature(name);
            setFeaturedCount(featuredCount-1);
        } catch (error) {
            console.log("Error unfeaturing group", error);
            showPopup(["Error Unfeaturing Group"])
        }
    }
	return(
            <ImageBackground
                source={require('../../../assets/background2.png')}
                style={styles.image}>
                    <SafeAreaView style={styles.body}>
                            {/* 'Create group' title on signup */}
                            <View style={styles.titlebox}>
                                <Text style={styles.title}> Feature {"\n"} Groups</Text>
                                <Text style={styles.count}> {featuredCount}/{totalFeatured}</Text>
                            </View>
                            {
                                <View style={styles.featuredBox}> 
                                    <Text style = {styles.featuredText}> Currently Featured </Text>
                                </View>
                            }
                            <FlatList
                            data={featured}
                            numColumns={1}
                            scrollEnabled= {true}
                            keyExtractor= {item => item.org_id}
                            renderItem= {({item})=>(
                                <View style= {styles.buttonRow}>
                                <View style={styles.directoryButton} >
                                    <Text style={styles.organizationtext}>{item.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => remove(item.name)}>
                                    <Octicons name='diff-removed' size={20} color={"red"}/>
                                </TouchableOpacity>
                                </View>
                            )}/>
                            {!isFull && 
                                <TouchableOpacity style = {styles.add}onPress={() => {setIsModalVisible(true)}}> 
                                        <AntDesign name='plus' size={30}/>
                                </TouchableOpacity>
                            }
                            <Popup
                                isVisible={isPopupVisible}
                                message={popupMessage}
                                onClose={() => setIsPopupVisible(false)}
                            />
                            <FeatureModal 
                                isVisible={isModalVisible}
                                onClose={() => setIsModalVisible(false)}
                            />
                    </SafeAreaView>
            </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        },
    body: {
        flex: 1,
    },
    featuredBox: {
        alignItems: "center",
        paddingBottom: 10,
    },
    featuredText: {
        fontSize: 20,
        color: "white",

    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    directoryButton: {
        flex: 1,
        borderRadius: 16,
        padding: 10,
        margin: 5,
        marginHorizontal: 20,
        backgroundColor: "white",
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
    content:{
        margin: 8,
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
    organizationtext: {
        fontSize: 25, 
        color: 'blacks'
    },
    count: {
        fontSize: 30,
        color: 'white',
        alignSelf: "flex-end"
        },
    requirements: {
        color: "red",
        fontSize: 14,
        fontWeight: "600"
    },
    optional: {
        color: "black",
        fontSize: 14,
        fontWeight: "600"
    },
    buttonRow: {
        flexDirection: "row",
        alignItems:"center",
        marginHorizontal: 10,
    },
    titlebox:{
        marginTop: 30,
        marginBottom: 30,
        marginHorizontal: 20
    },
    input: {
        height: 30,
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    label: {
        color: 'green',
        fontWeight: 'bold',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
    },
    add: {
        borderRadius: 16,
        padding:5,
        marginHorizontal: "40%",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 9,
    }
});
export default FeatureOrganization; 