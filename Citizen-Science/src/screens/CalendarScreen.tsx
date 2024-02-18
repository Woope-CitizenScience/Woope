import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Modal, TextInput, TouchableOpacity} from 'react-native';
import {fetchWithToken} from '../util/fetchWithToken';
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../util/AuthContext";
import {Agenda} from 'react-native-calendars'; // Calendar ~EV
import AsyncStorage from '@react-native-async-storage/async-storage';
//Styling Imports
import CustomButton from '../components/CustomButton';
import Blobs from '../components/Blobs';

interface Item {
	name: string;
	height: number;
	day: string;
  }
  type Event = {
	name: string;
	date: string;
	height: number;
  };


const CalendarScreen: React.FC = () => {
	const [items, setItems] = useState({});
	const [modalVisible, setModalVisible] = useState(false);	
	const [eventName, setEventName] = useState('');	
	const [eventDate, setEventDate] = useState('');

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
		  }			    // Load Items for Month View ~EV
		try {
			const storedEvents = await AsyncStorage.getItem('events');
			if (storedEvents) {
				const parsedStoredEvents = JSON.parse(storedEvents);
				setItems(parsedStoredEvents);
			}
		} catch (error) {
		console.error('Error loading events:', error);
		}
        // setTimeout(() => {
        //     const newItems = { ...items };      // create a copy of the state to avoid direct mutations to fill with 100 random default events ~EV
		// 	console.log("Loading items for month:", day);
		// 	for (let i = -14; i < 85; i++) {    // grants 100 day view (14 past, 85 future) ~EV
        //         const time = day.timestamp + i * 24 * 60 * 60 * 1000;   //tracking of date+time  ~EV
        //         const strTime = new Date(time).toISOString().split('T')[0]; // time + string naming convention ~EV
        //         if (!newItems[strTime]) {
        //             newItems[strTime] = [{
        //                 name: 'Default EVO Test Event',
        //                 height: 50, // Assign a specific default height in this case 50 ~EV
        //             }];
        //         }
        //     }
        //     setItems(newItems);
        // }, 1000);
    };

	const userCreateEvent = async () => { 							// Handle for the User Created Cal Events ~EV
		const event : Event = { name: eventName, date: eventDate, height: 500,}; 		// Created a new event with the user input ~EV
		
		if (eventName === '' || eventDate === '') {			// If the user input is empty force user to input info ~EV
			alert ('Please enter both a title and date for the event.');
			return;												
		}

		try {
			const storedEvents  = await AsyncStorage.getItem('events');	// Get the existing events ~EV
			const parsedStoredEvents = storedEvents ? JSON.parse(storedEvents) : {};

			const updatedEvents = {...parsedStoredEvents,
				[event.date]: [...(parsedStoredEvents[event.date] || []), event],
			};
	  
			await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
	  
			setEventName('');
			setEventDate('');
			setModalVisible(false);
	  
			loadItems();									
		}
		catch (error) {
			console.log('error in event creation', error);
			alert('Error creating event');
		}
	};

    // Render Items
    const renderItem = (item: Item) => {
        return (
			<View style={styles.item}>
				<Text>{item.name}</Text>
			</View>
		);
    };
	
	return (
		<View style={styles.container}>
		  <Agenda
			items={items}
			loadItemsForMonth={loadItems}
			renderItem={renderItem}
			theme={{
				agendaDayTextColor: 'blue',
				agendaDayNumColor: 'blue',
				agendaTodayColor: 'blue',
				agendaKnobColor: 'blue'
			}}
			renderEmptyData={() => {
				return (
				  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<Text>No Items For This Day</Text>
				  </View>
				);
			  }}
		  />
	
		  <TouchableOpacity
			style={styles.createButton}
			onPress={() => setModalVisible(true)}
		  >
			<Text style={styles.createButtonText}>Create Event</Text>
		  </TouchableOpacity>
		
		  <Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
			  setModalVisible(false);
			}}
		  >
			<View style={styles.centeredView}>
			  <View style={styles.modalView}>
				<Blobs
					widthPercentage={10}
					heightPercentage={10}
					position={{ top: 10 , left: 22}}
		   		/>
				<Blobs
					widthPercentage={10}
					heightPercentage={10}
					position={{ top: 3 , left: 14}}
		   		/>
				<Blobs
					widthPercentage={10}
					heightPercentage={10}
					position={{ top: 1 , left: 29}}
		   		/>
				<Blobs
					widthPercentage={10}
					heightPercentage={19}
					position={{ top: 27 , left: 4}}
		   		/>
				<Blobs
					widthPercentage={8}
					heightPercentage={9}
					position={{ top: 32 , left: 24}}
		   		/>
				<Blobs
					widthPercentage={8}
					heightPercentage={9}
					position={{ top: 12 , left: 2}}
		   		/>
				<TextInput
				  style={styles.input}
				  placeholder="Event Name"
				  value={eventName}
				  onChangeText={setEventName}
				  placeholderTextColor="darkgray"
				/>
				<TextInput
				  style={styles.input}
				  placeholder="Event Date (YYYY-MM-DD)"
				  value={eventDate}
				  onChangeText={setEventDate}
				  placeholderTextColor="darkgray"
				/>
				<Button title="Create Event" onPress={userCreateEvent} />
					<TouchableOpacity
					  style={styles.cancelButton} onPress={() => setModalVisible(false)}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					  </TouchableOpacity>
			  </View>
			</View>
		  </Modal>
		</View>
	  );
	};
	
	const styles = StyleSheet.create({
	  container: {
		flex: 1,
	  },
	  item: {
		backgroundColor: 'lightblue',
		borderRadius: 5,
		padding: 10,
		marginVertical: 8,
		marginHorizontal: 16,
	  },
	  createButton: {
		position: 'absolute',
		bottom: 20,
		alignSelf: 'center',
		backgroundColor: '#1E90FF',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
		width: 200,
		boarderWidth: 0,
		boarderColor: 'transparent',
	  },
	  createButtonText: {
		color: '#FFFFFF',
		fontSize: 18,
		textAlign: 'center',
	  },
	  cancelButton: {
		backgroundColor: '#FF6347',
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
		padding: 75,
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
		width: 300,
		backgroundColor: 'white',
	  },
	});

export default CalendarScreen;


// Thematic Refrence LINKS DELETE LATER
// https://aktalakota.stjo.org/lakota_spirit_animal/wolf-sungmanitu-t%c8%9fanka/
// https://www.lakotaonline.com/resources/references-information/calendar-of-events
// https://aktalakota.stjo.org/lakota-seasons-moon-phases/
// Technichal Refrence LINKS DELETE LATER
// https://wix.github.io/react-native-calendars/docs/Components/Agenda
// https://wix.github.io/react-native-calendars/docs/Testing
// https://reactnative.dev/docs/asyncstorage