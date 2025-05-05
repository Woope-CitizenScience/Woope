import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, Dimensions, SafeAreaView, FlatList, TouchableOpacity, InteractionManager} from "react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { getResourceInfo } from "../api/resources";
import { Resource } from "../api/types";
import { AntDesign } from '@expo/vector-icons';
import UpdateResourceModal from "./UpdateResourceModal";
import DeleteResource from "./DeleteResources";

interface ResourceProps{
    org_id: number;
    resource_id: number;
}

//Component to display event information 
const ResourcesCard:React.FC<ResourceProps> = ({resource_id, org_id}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [data, setData] = useState<Resource[]>([]);
    const [isFinished, setIsFinished] = useState<Boolean>(false);
    useFocusEffect(
        React.useCallback(() => {
          const task = InteractionManager.runAfterInteractions(() => {
            fetchInfo();
          });
        }, [isModalVisible, setData, setIsFinished]))

    const fetchInfo = async () => {
        try {
            const resource = await getResourceInfo(resource_id);
            setData(resource);
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <SafeAreaView>
            <FlatList 
            data={data}
            keyExtractor={(item) => item.resource_id}
            scrollEnabled= {false}
            renderItem={({item}) => (
                <View style={styles.cardContainer}>
                    <View style ={styles.headerContainer}>
                        <View>
                            <Text style={styles.title}>{item.name}</Text>
                        </View>
                        <View style = {styles.editContainer}>
                            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                    <AntDesign name="edit" size={30}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsDeleteVisible(true)}>
                                    <AntDesign name="delete" size={30}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Short Tagline */}
                    <View>
                        <Text style={styles.tagline}>{item.tagline}</Text>
                    </View>
                    {/* Full Description */}
                    <View>
                        <Text style={styles.description}>{item.text_description}</Text>
                    </View>
                    {/*Optional Banner Image */}
                    <View>
                        { item.image_path && <Image 
                        style={styles.imageStyle} 
                        source={{uri: process.env.EXPO_PUBLIC_API_URL + '/uploads/' + item.image_path}}
                        allowDownscaling={true}
                        onDisplay={() => setIsFinished(!isFinished)}
                        />}
                    </View>
                    <UpdateResourceModal isVisible = {isModalVisible} resource_id = {resource_id} onClose={() => {
                        setIsModalVisible(false);
                        fetchInfo();
                    }} />
                    <DeleteResource isVisible = {isDeleteVisible} resource_id={resource_id} org_id={org_id} onClose={() => {
                            setIsDeleteVisible(false);
                    }} />
                </View>
            )}/>
        </SafeAreaView>
    );
};
const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
    editContainer: {
        flexDirection: "row",
        gap: 20,
    },
    cardContainer: { 
        width: deviceWidth - 20,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 0,
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
        gap: 20,
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

export default ResourcesCard;