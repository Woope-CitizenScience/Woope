import React, {useEffect, useState} from 'react'
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import EventCard from '../../components/EventCard';
import EventCardViewOnly from '../../components/EventCardViewOnly';
import { Event } from '../../api/types';
import { getDayEvents, getFollowedEvents, getUserEvents } from '../../api/event';
import { addDays, set } from 'date-fns';

const DateScreen = ({route}) => {
    const navigation = useNavigation<any>();
    let [now, setNow] = useState<Date>();
    let [dayAfter, setDayAfter] = useState<Date>(new Date());
    let [dateString, setDateString] = useState(route.params.dateString)
    let [eventData, setEventData] = useState<Event[]>([]);
    let [stylePublic, setStylePublic] = useState(styles.selected);
    let [styleFollowed, setStyleFollowed] = useState(styles.options);
    let [stylePrivate, setStylePrivate] = useState(styles.options);
    const [generalEventList, setGeneralEventList] = useState<Event[]>([])
    const [followedEventList, setfollowedEventList] = useState<Event[]>([]);
    const [userEventList, setUserEventList] = useState<Event[]>([]);

    // ! from the recieved datestring, converts it to correct UTC using users timezone offset. Translating the recieved datestring
    // ! straight into UTC will not give correct offset leading to odd results.
    let [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date(dateString).getTime() + new Date(dateString).getTimezoneOffset() * 60000));

    // gets correct date range for query and populates flatlist with general dates
    // also loads separate lists of general/followed/user events to be toggled between without having to do a separate query each time
    useEffect(() => {
            getRange();
            Promise.all([fetchEvents(),fetchFollowedEvents(),fetchUserEvents()]).then((values => {
                
            }))
    },[]);

    //sets flatlist to show general events as default
    const getRange = async() => {
        dayAfter = addDays(selectedDate, 1);
        try {
            const eventList = await getDayEvents(selectedDate, dayAfter);
            setEventData(eventList);
        } catch (error) {
            console.log(error)
        }
    }

    // retrieve all events from the given date, updatesflatlist
    const fetchEvents = async () => {
        try {
            const eventList = await getDayEvents(selectedDate, dayAfter);
            setGeneralEventList(eventList);
        } catch (error) {
            console.log(error);
        }
    }
    // retrieves all followed events from the given date, updatesflatlist
    const fetchFollowedEvents = async () => {
        try {
            const followedList = await getFollowedEvents(selectedDate, dayAfter, route.params.id);
            setfollowedEventList(followedList);
        } catch (error) {
            console.log(error);
        }
    }
    //retrieves all user/private events from the given date range, updates flatlist
    const fetchUserEvents = async () => {
        try {
            const userList = await getUserEvents(selectedDate, dayAfter, route.params.id);
            setUserEventList(userList)
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <SafeAreaView style={styles.container}>
             <View>
                <View style={styles.upcomingEvents}>
                    <Text style={styles.title}>{selectedDate.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        
                    })}</Text>
                </View>
            </View>

            <FlatList
            data={eventData}
            scrollEnabled={true}
            keyExtractor={(item) => item.event_id} 
            renderItem={({item}) => (
                <EventCardViewOnly
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
                <TouchableOpacity style={stylePublic} onPress={() => {
                    setEventData(generalEventList);
                    setStylePublic(styles.selected);
                    setStyleFollowed(styles.options);
                    setStylePrivate(styles.options);
                    
                }}>
                    <View>
                        <Text>
                            Public
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styleFollowed} onPress={() => {
                    setEventData(followedEventList);
                    setStylePublic(styles.options);
                    setStyleFollowed(styles.selected);
                    setStylePrivate(styles.options);
                }}>
                    <View>
                        <Text>
                            Followed
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={stylePrivate} onPress={() => {
                    setEventData(userEventList);
                    setStylePublic(styles.options);
                    setStyleFollowed(styles.options);
                    setStylePrivate(styles.selected);
                }}>
                    <View>
                        <Text>
                            Private
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
        paddingTop: StatusBar.currentHeight,
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
