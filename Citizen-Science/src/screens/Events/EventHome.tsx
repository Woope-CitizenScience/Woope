import React, {useState,useEffect, useContext} from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../../components/EventCard';
import CreateEvent from '../../components/CreateEvent';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { getEvents } from '../../api/event';
import { Event } from '../../api/types';

export const EventHome = ({route}) => {
    const navigation = useNavigation<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [eventData, setEventData] = useState<Event[]>([]);
    const fetchEvents = async () => {
            try {
                const eventList = await getEvents(route.params.org_id);
                setEventData(eventList);
            } catch (error) {
                console.log(error);
            }
        }
    useEffect(() => {
        fetchEvents();
    })
    return(
        <SafeAreaView style = {styles.container}>
            <View>
                <View style={styles.upcomingEvents}>
                    <Text style={styles.title}>All Events</Text>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <Octicons style={styles.addIcon} name='diff-added' size={30}/>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
            data={eventData}
            scrollEnabled={true}
            keyExtractor={(item) => item.event_id} 
            renderItem={({item}) => (
                <EventCard 
                    event_id = {item.event_id} 
                    org_id = {item.org_id} 
                />
            )}/> 
            <CreateEvent org_id={route.params.org_id} isVisible = {isModalVisible} onClose={() => 
                {
                setIsModalVisible(false)
                fetchEvents();
                }
            }/>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    addIcon: {

    },
    scrollview: {
        flex: 1,
    },
    container: {
        flex: 1,
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
    upcomingEvents: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection:"row",
        marginHorizontal:20,
        marginBottom: 5,
        padding: 10,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    
    
});
export default EventHome