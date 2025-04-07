import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import EventCard from '../../components/EventCard';
import { Event } from '../../api/types';
import { getDayEvents } from '../../api/event';

const DateScreen = ({route}) => {
    const navigation = useNavigation<any>();
    useEffect(() => {
        fetchEvents()
    }, )
    const [eventData, setEventData] = useState<Event[]>([]);
    
    // retrieve all events from the given date
    const fetchEvents = async () => {
        try {
            const eventList = await getDayEvents(route.params.dayNum, route.params.month, route.params.year, route.params.id);
            setEventData(eventList);
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <SafeAreaView>
             <View>
                <View style={styles.upcomingEvents}>
                    <Text style={styles.title}>{route.params.month}-{route.params.dayNum}-{route.params.year} Events</Text>
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
                    name = {item.name}
                    tagline = {item.tagline}
                    time_begin = {item.time_begin}
                    time_end = {item.time_end}
                    text_description = {item.text_description}
                    // !! CHANGE ONCE IMPLEMENETED
                    image_path =  {""}
                />
            )}/> 
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
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

export default DateScreen;
