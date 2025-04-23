import React, {useEffect, useState} from 'react'
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import EventCard from '../../components/EventCard';
import { Event } from '../../api/types';
import { getDayEvents } from '../../api/event';
import { Button } from 'react-native-paper';
import { addDays } from 'date-fns';

const DateScreen = ({route}) => {
    const navigation = useNavigation<any>();
    let [now, setNow] = useState<Date>();
    let [selectedDate, setSelectedDate] = useState<Date>(new Date());
    let [dayAfter, setDayAfter] = useState<Date>(new Date());
    let [dateString, setDateString] = useState(route.params.dateString)
  

    useFocusEffect(() => {
        getRange();
        fetchEvents();
    }, )

    const [eventData, setEventData] = useState<Event[]>([]);
    const [followedEventData, setfollowedEventData] = useState<Event[]>([]);
    const [userEventData, setUserEventData] = useState<Event[]>([]);
    
    const getRange = () => {
        now = new Date(dateString);
        selectedDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        dayAfter = addDays(selectedDate, 1);
    }
    // retrieve all events from the given date
    const fetchEvents = async () => {
        try {
            const eventList = await getDayEvents(selectedDate, dayAfter);
            setEventData(eventList);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchFollowedEvents = async () => {
        try {
            
        } catch (error) {
            
        }
    }
    const fetchUserEvents = async () => {
        try {
            
        } catch (error) {
            
        }
    }
    return(
        <SafeAreaView style={styles.container}>
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

<View style={styles.buttonBar}>
                <TouchableOpacity style={styles.selected}>
                    <View>
                        <Text>
                            All
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options}>
                    <View>
                        <Text>
                            Followed
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options}>
                    <View>
                        <Text>
                            Personal
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
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
    options: {
        borderRadius: 10,
        padding: 15,
        width: '25%',
        backgroundColor: "white",
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
    selected: {
        borderRadius: 10,
        padding: 15,
        width: '25%',
        backgroundColor: "#B4D7EE",
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
    buttonBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    }
    
    
});
export default DateScreen;
