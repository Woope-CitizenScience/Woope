import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Modal, TextInput, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';
import {fetchWithToken} from '../util/fetchWithToken';
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../util/AuthContext";
import {Agenda} from 'react-native-calendars'; // Calendar ~EV
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { Card, Avatar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Item {
    name: string;
    height: number;
    day: Date;
    startTime: string;
    endTime: string;
    location: string;
}
type Event = {
    name: string;
    date: string;
    height: number;
    startTime: string;
    location: string;
};

/**
 * 
 * !TODO: REDO CALENDAR SCREEN TO INTERACT WITH DATABASE EVENTS, REMOVE HARDCODED EVENTS
 * ?: CONSIDER USING SOMETHING OTHER THAN REACT NATIVE CALENDARS, might have to create one?? Either that or reevaluate 
 * ?: usecases for the calendar page.
 */

const CalendarScreen: React.FC = () => {
	// Todo, remove this after trip
    const hard_coded_events = {
        '2024-02-21': [
            {name: 'Flying out to North Dakota', startTime: '10:00am', endTime: '11:00am', location: 'LAX Airport'}
        ],
        '2024-02-24': [
            {name: 'Flying back to Los Angeles', startTime: '10:00am', endTime: '11:00am', location: 'Bismark Airport'}
        ],
        '2024-02-22': [
            {name: 'Meeting with Dr. Mafany', startTime: '8:00am', endTime: '6:00pm', location: 'Sitting Bull College'}
        ],
        '2024-02-23': [
            {name: 'Demo app for SBC' , startTime: '8:00am', endTime: '3:00pm', location: 'Sitting Bull College'}
        ]

    };

	const [items, setItems] = useState({});
	const [modalVisible, setModalVisible] = useState(false);
	const [eventName, setEventName] = useState('');
	const [eventDate, setEventDate] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const now = new Date();
	const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const [selectedDate, setSelectedDate] = useState(localMidnight);
	const [startTime, setStartTime] = useState('');
	const [location, setLocation] = useState('');

    // TODO Uncomment when implementing backend
	// testing fetchWithToken
	// useEffect(() => {
	// 	if (isFocused) {
	// 		const fetchData = async () => {
	// 			const { response, newAccessToken, tokenRefreshFailed } = await fetchWithToken(`${process.env.EXPO_PUBLIC_API_URL}/health/protected-route`);
	// 			if (newAccessToken && newAccessToken !== userToken) {
	// 				setUserToken(newAccessToken);
	// 			} else if (tokenRefreshFailed) {
	// 				setUserToken(null);
	// 			}
	// 		};
	// 		fetchData();
	// 	}
	// }, [isFocused]);

	// Calendar ~EV

	const loadItems = async (day: any) => {
		if (!day) {
			return;
		}
		try {
			const storedEvents = await AsyncStorage.getItem('events');
			let parsedStoredEvents = storedEvents ? JSON.parse(storedEvents) : {};
			// Merge hard-coded events with stored events
			parsedStoredEvents = { ...parsedStoredEvents, ...hard_coded_events };
			setItems(parsedStoredEvents);
		} catch (error) {
			console.error('Error loading events:', error);
		}
	};

	const userCreateEvent = async () => {
		// Include startTime and location in the event object
		const event: Event = {
			name: eventName,
			date: eventDate,
			height: 500, // You might want to reconsider the use of 'height' for dynamic content
			startTime: startTime,
			location: location
		};

		if (eventName === '' || eventDate === '' || startTime === '' || location === '') {
			alert('Please enter all details for the event.');
			return;
		}

		try {
			const storedEvents = await AsyncStorage.getItem('events');
			let parsedStoredEvents = storedEvents ? JSON.parse(storedEvents) : {};

			// No need to merge hard-coded events here if they are only temporary
			// But if they should be included, ensure they have the same structure

			const updatedEventsForDate = parsedStoredEvents[event.date]
				? [...parsedStoredEvents[event.date], event]
				: [event];

			const updatedEvents = {
				...parsedStoredEvents,
				[event.date]: updatedEventsForDate,
			};

			await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));

			// Reset form
			setEventName('');
			setEventDate('');
			setStartTime('');
			setLocation('');
			setModalVisible(false);

			loadItems({ dateString: event.date }); // Make sure to refresh the events
		} catch (error) {
			console.log(error, 'error in event creation');
			alert('Error creating event');
		}
	};


	const deleteEvent = async (day: string, event: Event) => {		// Handle for the User Deleted Cal Events ~EV
		try {
			const storedEvents = await AsyncStorage.getItem('events');
			const parsedStoredEvents = storedEvents ? JSON.parse(storedEvents) : {};
			const updatedEvents = {
				...parsedStoredEvents,
				[day]: parsedStoredEvents[day].filter((e: Event) => e !== event),
			};
			await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
			loadItems(day);
		} catch (error) {
			console.log(error, 'error in event deletion');
			alert('Error deleting event');
		}
	};


	const handleDateChange = (event: Event, selectedDate: Date) => {
		if (selectedDate !== undefined) {
			setShowDatePicker(false);
			const year = selectedDate.getFullYear();
			const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2); // Months are 0 indexed so +1 and slice for leading 0
			const day = ("0" + selectedDate.getDate()).slice(-2);
			setEventDate(`${year}-${month}-${day}`);
			setSelectedDate(selectedDate);
		}
	};


	const handleDeleteAllEvents = async () => {
		try {
			await AsyncStorage.removeItem('events');
			console.log('All events deleted successfully');
			// Optionally set state or trigger a UI update
		} catch (error) {
			console.error('Error deleting all events:', error);
		}
	};


	// Render Items
    const renderItem = (item: Item) => {
        return (
			<TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
                <Card>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>

							{/*<Button title="Delete All Events" onPress={handleDeleteAllEvents} />*/}



							<Text style={{fontWeight: 'bold'}}>
                                {item.name} {'\n'}
                                <Text style={{fontSize: 12, fontWeight: 'normal'}}>
                                    {item.startTime} {'\n'}
                                </Text>
                                <Text style={{fontSize: 12, fontWeight: 'normal', fontStyle: 'italic'}}>
                                    {item.location}
                                </Text>
                            </Text>
                            <Avatar.Text label="C"/>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
		);
    };

	return (
		<SafeAreaView style={[styles.container, {backgroundColor: modalVisible ? 'white' : 'white'}]}>
		  <Agenda
			  items={items}
			  loadItemsForMonth={loadItems}
			  renderItem={renderItem}
			  theme={{
				  agendaDayTextColor: '#5EA1E9',
				  agendaDayNumColor: '#5EA1E9',
				  agendaTodayColor: '#5EA1E9',
				  agendaKnobColor: '#5EA1E9'
			  }}

			  renderEmptyData={() => {
				  return (
					  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						  <Text>No Items For This Day</Text>
					  </View>
				  );
			  }}

		  />

		  <Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
			  setModalVisible(false);
			}}
		  >
			{/* Modal content */}
			<View style={styles.centeredView}>
			  <View style={styles.modalView}>
				<TextInput
				  style={styles.input}
				  placeholder="Event Name"
				  value={eventName}
				  onChangeText={setEventName}
				  placeholderTextColor={'darkgray'}
				/>

				<TextInput
				  style={styles.input}
				  placeholder="Start Time (HH:MM AM/PM)"
				  value={startTime}
				  onChangeText={setStartTime}
				  placeholderTextColor="darkgray"
				/>
				<TextInput
				  style={styles.input}
				  placeholder="Set Location"
				  value={location}
				  onChangeText={setLocation}
				  placeholderTextColor="darkgray"
				/>
				<TextInput
				  style={styles.input}
				  placeholder="Event Date (YYYY-MM-DD)"
				  value={eventDate}
				  onChangeText={setEventDate}
				  placeholderTextColor="darkgray"
				/>
				<TouchableOpacity onPress={() => setShowDatePicker(true)}>
						<Text style={styles.datePickerText}>Select Date</Text>
				</TouchableOpacity>
				{showDatePicker && (
					<DateTimePicker
						testID="dateTimePicker"
						value={selectedDate}
						mode="date"
						is24Hour={true}
						display="default"
						onChange={handleDateChange}
					/>

				)}
				<Button title="Create Event" onPress={userCreateEvent} />
					<TouchableOpacity
					  style={styles.cancelButton} onPress={() => setModalVisible(false)}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					  </TouchableOpacity>
			  </View>
			</View>
		  </Modal>
			{!modalVisible && (
			<TouchableOpacity
			style={styles.createButton}
			onPress={() => setModalVisible(true)}
			>
			<Text style={styles.createButtonText}>Create Event</Text>
			</TouchableOpacity>
		)}
		</SafeAreaView>

	  );
	};

	const styles = StyleSheet.create({
		container: {
		  flex: 1,
		  backgroundColor: 'white',
		},
		centeredView: {
		  flex: 1,
		  justifyContent: 'center',
		  alignItems: 'center',
		  marginTop: 22,
		},
		modalView: {
		  margin: 20,
		  backgroundColor: 'white',
		  borderRadius: 20,
		  padding: 35,
		  alignItems: 'center',
		  shadowColor: '#000',
		  shadowOffset: {
			width: 0,
			height: 2,
		  },
		  shadowOpacity: 0.25,
		  shadowRadius: 4,
		  elevation: 5,
		},
		input: {
		  width: 300,
		  height: 40,
		  marginBottom: 12,
		  borderWidth: 1,
		  padding: 10,
		},
		createButton: {
		  backgroundColor: '#1E90FF',
		  padding: 10,
		  borderRadius: 20,
		  position: 'absolute',
		  bottom: 20,
		  alignSelf: 'center',
		},
		createButtonText: {
		  color: 'white',
		  fontSize: 16,
		  textAlign: 'center',
		},
	  cancelButton: {
		backgroundColor: '#1E90FF',
		marginTop: 30,
		marginBottom: -30,
		paddingHorizontal: 25,
		paddingVertical: 4,
		borderRadius: 5,
	  },
	  cancelButtonText: {
		color: '#FFFFFF',
		fontSize: 18,
		textAlign: 'center',
	  },
	  centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	  },
	  modalView: {
		backgroundColor: 'white', //B3FAF4
		borderRadius: 20,
		padding: 65,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 2,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	  },
	  input: {
		height: 50,
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 30,
		paddingHorizontal: 10,
		width: 250,
		backgroundColor: 'white',
	  },
	  datePickerText: {
        marginBottom: 10,
        color: '#1E90FF',
        fontSize: 18,
      },
	});

export default CalendarScreen;
