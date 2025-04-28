import React,{useState,useEffect} from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, SafeAreaView,FlatList } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import UpdateEventModal from "./UpdateEventModal";
import { getEventInfo, deleteEvent} from "../api/event";

interface EventProps {
    event_id: number;
    org_id: number;
    name: string;
    tagline: string;
    text_description: string;
    time_begin: Date;
    time_end: Date;
    image_path: string;
}
//Component to display event information 
const EventCardViewOnly:React.FC<EventProps> = ({event_id, org_id, name, tagline, text_description, time_begin, time_end, image_path}) => {
    // let startDate = new Date(time_begin);
    // let endDate = new Date(time_end);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [data, setData] = useState<EventProps[]>([]);
  
    return(
        // Container
        <SafeAreaView>
            <View style={styles.cardContainer}>
                {/*Event Name, Date, Time */}
                <View style ={styles.headerContainer}>
                    <View>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.category}>{new Date(time_begin).toLocaleDateString([],{weekday: 'long', month:'long', day:'2-digit', year:'numeric'})}</Text>
                        <Text style={styles.category}>{new Date(time_begin).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})} - {new Date(time_end).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})}</Text>
                        <Text style={styles.category}>Location</Text>
                    </View>
                </View>
                {/*Organization Banner Image */}
                <View>
                    {image_path && <Image style={styles.imageStyle}source={require('../../assets/adaptive-icon.png')}/>}
                </View>
                {/* Short Tagline */}
                <View>
                    <Text style={styles.tagline}>{tagline}</Text>
                </View>
                {/* Full Description */}
                <View>
                    <Text style={styles.description}>{text_description}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};
const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
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
    editContainer: {
        flexDirection: "row",
        gap: 20,
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

export default EventCardViewOnly;