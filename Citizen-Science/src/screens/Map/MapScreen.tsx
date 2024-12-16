import React, { useState, useEffect, useRef } from 'react';

import {
	View,
	Dimensions,
	Modal,
	TextInput,
	StyleSheet,
	Image,
	TouchableOpacity,
	Text,
	ScrollView,
} from 'react-native';
import { createPinNew } from '../../api/pins';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const windowWidth = Dimensions.get('window').width;

interface Location {
	latitude: number;
	longitude: number;
}

interface Region {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

interface Pin {
	name: string;
	date: string;
	description: string;
	tag: string;
	image: string | null;
	location: {
		latitude: number;
		longitude: number;
	};
}

export const MapScreen = () => {
	const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
	const [initialRegion, setInitialRegion] = useState<Region | null>(null);
	const [pins, setPins] = useState<Pin[]>([]);
	const [filteredPins, setFilteredPins] = useState<Pin[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [detailsVisible, setDetailsVisible] = useState(false); // For the sliding info modal
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedPin, setSelectedPin] = useState<Pin | null>(null); // Pin selected for details
	const [formLocation, setFormLocation] = useState<Location | null>(null);
	const [isMarkerPressed, setIsMarkerPressed] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		date: '',
		description: '',
		tag: 'General',
		image: null,
	});
	const [filterTag, setFilterTag] = useState('All'); // For filtering pins

	// Dropdown state for Tag Picker
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [tagItems, setTagItems] = useState([
		{ label: 'General', value: 'General' },
		{ label: 'Event', value: 'Event' },
		{ label: 'Weather', value: 'Weather' },
		{ label: 'Workshop', value: 'Workshop' },

	]);

	useEffect(() => {
		const getLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.log('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setCurrentLocation(location.coords);

			setInitialRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			});
		};

		getLocation();
	}, []);

	useEffect(() => {
		// Filter pins based on the selected tag
		if (filterTag === 'All') {
			setFilteredPins(pins);
		} else {
			setFilteredPins(pins.filter((pin) => pin.tag === filterTag));
		}
	}, [pins, filterTag]);


const isMarkerPressedRef = useRef(false);

const handleMarkerPress = (pin: Pin) => {
    console.log('Marker pressed:', pin);
    isMarkerPressedRef.current = true; // Update ref value immediately
    setIsMarkerPressed(true); // Update state for UI
    setSelectedPin(pin); // Set the selected pin for details
    setDetailsVisible(true);
};

const handleMapPress = (event: { nativeEvent: { coordinate: Location } }) => {
    if (isMarkerPressedRef.current || detailsVisible) {
        console.log('Ignoring map press due to marker press');
        isMarkerPressedRef.current = false; // Reset the flag
        return;
    }

    const { coordinate } = event.nativeEvent;
    setFormLocation(coordinate); // Save the location of the tap
    setModalVisible(true); // Show the form modal
};

	
	
	const closeDetailsModal = () => {
		setSelectedPin(null); // Clear the selected pin
		setDetailsVisible(false); // Close the details modal
		isMarkerPressedRef.current = false; // Reset the flag
		setIsMarkerPressed(false); // Reset marker pressed state
	};

	
	
	

	const handleFormSubmit = () => {
		// Validate form before submission
		if (!formData.name || !formData.date || !formData.description || !formData.tag) {
			alert('Please fill out all fields before submitting.');
			return;
		}

		if (formLocation) {
			// Add the new pin to the pins state
			setPins((prev) => [
				...prev,
				{
					name: formData.name,
					date: formData.date,
					description: formData.description,
					tag: formData.tag,
					image: formData.image,
					location: formLocation,
				},
			]);
		}
		// hardcoded stuff, update later, get latitude and longitude from location, create unique pin_id using triggers?
		let newDate = new Date(formData.date)
		createPinNew(400,formData.name,formData.description,newDate,formData.tag,1,1);
		// Reset form and hide modal
		setFormData({ name: '', date: '', description: '', tag: 'General', image: null });
		setFormLocation(null);
		setModalVisible(false);
		
	};

	const handlePickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setFormData({ ...formData, image: result.assets[0].uri });
		}
	};
	

	const resetModals = () => {
		setModalVisible(false);
		setDetailsVisible(false);
		setSelectedPin(null);
		setFormLocation(null);
	};
	
	

	return (
		<View style={styles.container}>

    {/* Map */}
    {initialRegion && (
       <MapView
	   style={styles.map}
	   initialRegion={initialRegion}
	   onPress={handleMapPress}
	   showsUserLocation
	   showsMyLocationButton
	   showsCompass
   >
	   {filteredPins.map((pin, index) => (
		   <Marker
			   key={index}
			   coordinate={pin.location}
			   title={pin.name}
			   description={pin.description}
			   onPress={() => handleMarkerPress(pin)} // Handle marker press for viewing pin
		   >
			   {pin.image && (
				   <Image
					   source={{ uri: pin.image }}
					   style={{ width: 50, height: 50, borderRadius: 25 }}
				   />
			   )}
		   </Marker>
	   ))}
   </MapView>
   
    )}
    
	{/*filters buttons*/}
	<ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterContainer}
    style={styles.filterWrapper} // Ensure proper positioning at the bottom
	>
    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterTag('All')}>
        <Text style={styles.filterButtonText}>All</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterTag('General')}>
        <Text style={styles.filterButtonText}>General</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterTag('Weather')}>
        <Text style={styles.filterButtonText}>Weather</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterTag('Event')}>
        <Text style={styles.filterButtonText}>Event</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterTag('Workshop')}>
        <Text style={styles.filterButtonText}>Workshop</Text>
    </TouchableOpacity>
	</ScrollView>


			{/* Modal for Adding a New Pin */}
			<Modal visible={modalVisible} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Add a New Pin</Text>
        <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        {/* Simple Date Picker */}
        <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowDatePicker(true)}
        >
            <Text style={styles.datePickerText}>
                {formData.date ? formData.date : 'Pick a Date'}
            </Text>
        </TouchableOpacity>
        {showDatePicker && (
            <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    setShowDatePicker(false); // Close the picker
                    if (selectedDate) {
                        setFormData({
                            ...formData,
                            date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                        });
                    }
                }}
            />
        )}
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
        />
        {/* Dropdown Picker for Tags */}
        <DropDownPicker
            open={dropdownOpen}
            value={formData.tag}
            items={tagItems}
            setOpen={setDropdownOpen}
            setValue={(callback) =>
                setFormData({ ...formData, tag: callback(formData.tag) })
            }
            setItems={setTagItems}
            style={styles.dropdown}
        />
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            <Text style={styles.imagePickerText}>
                {formData.image ? 'Change Image' : 'Add Image'}
            </Text>
        </TouchableOpacity>
        {formData.image && (
            <Image source={{ uri: formData.image }} style={styles.previewImage} />
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
            >
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleFormSubmit}
            >
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
{/* Modal for Viewing Pin Details */}
<Modal visible={detailsVisible} animationType="slide" transparent={true}>
    <View style={styles.detailsContainer}>
        <TouchableOpacity
            style={styles.closeButton}
            onPress={closeDetailsModal} // Close the modal
        >
            <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        {selectedPin && (
            <>
                <Text style={styles.detailsTitle}>{selectedPin.name}</Text>
                <Text style={styles.detailsDate}>Date: {selectedPin.date}</Text>
                <Text style={styles.detailsDescription}>{selectedPin.description}</Text>
                <Text style={styles.detailsTag}>Tag: {selectedPin.tag}</Text>
                {selectedPin.image && (
                    <Image
                        source={{ uri: selectedPin.image }}
                        style={styles.detailsImage}
                    />
                )}
            </>
        )}
    </View>
</Modal>


		</View>
	);
};
const styles = StyleSheet.create({
		container: {
			flex: 1,
		},
		map: {
			flex: 1,
		},
		filterContainer: {
			flexDirection: 'row', // Arrange buttons in a row
			paddingHorizontal: 5, // Add padding for spacing
			alignItems: 'center', // Center align the buttons vertically
		},
		filterWrapper: {
			position: 'absolute',
			bottom: 10, // Position at the bottom of the screen
			width: '100%',
			zIndex: 1, // Ensure it appears above the map
			backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional for visibility
			paddingVertical: 5,
		},
		filterButton: {
			backgroundColor: '#007AFF',
			padding: 10,
			borderRadius: 5,
			marginHorizontal: 5, // Add space between buttons
		},
		filterButtonText: {
			color: 'white',
			fontWeight: 'bold',
		},
		modalContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
		},
		modalTitle: {
			fontSize: 20,
			fontWeight: 'bold',
			color: 'white',
			marginBottom: 20,
		},
		input: {
			width: '80%',
			backgroundColor: 'white',
			padding: 10,
			marginBottom: 10,
			borderRadius: 5,
		},
		textArea: {
			height: 100,
			textAlignVertical: 'top',
		},
		dropdown: {
			width: '80%',
			marginBottom: 10,
			alignSelf: 'center'
		},
		imagePicker: {
			backgroundColor: '#ccc',
			padding: 10,
			borderRadius: 5,
			marginBottom: 10,
		},
		imagePickerText: {
			color: '#000',
			textAlign: 'center',
		},
		previewImage: {
			width: 100,
			height: 100,
			marginTop: 10,
			borderRadius: 10,
		},
		buttonContainer: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			width: '80%',
			marginTop: 10,
		},
		cancelButton: {
			backgroundColor: '#d9534f',
			padding: 10,
			borderRadius: 5,
		},
		submitButton: {
			backgroundColor: '#5cb85c',
			padding: 10,
			borderRadius: 5,
		},
		buttonText: {
			color: 'white',
			fontWeight: 'bold',
		},
		detailsContainer: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			backgroundColor: 'white',
			padding: 10,
			borderTopLeftRadius: 15,
			borderTopRightRadius: 15,
			height: '75%', // Adjust based on the desired size
			shadowColor: '#000',
			shadowOffset: { width: 0, height: -2 },
			shadowOpacity: 0.2,
			shadowRadius: 5,
			elevation: 10, // For Android shadow
		},
		closeButton: {
			alignSelf: 'flex-end',
			marginBottom: 10,
		},
		closeButtonText: {
			color: '#007AFF',
			fontWeight: 'bold',
		},
		detailsImage: {
			width: '100%',
			height: 200,
			borderRadius: 10,
			marginTop: 10,
		},
		detailsTitle: {
			fontSize: 22,
			fontWeight: 'bold',
			color: '#333',
			marginBottom: 10,
		},
		detailsDate: {
			fontSize: 16,
			color: '#555',
			marginBottom: 5,
		},
		detailsDescription: {
			fontSize: 16,
			color: '#666',
			marginBottom: 10,
			lineHeight: 22,
		},
		detailsTag: {
			fontSize: 14,
			color: '#888',
			marginBottom: 10,
			fontStyle: 'italic',
		},
		datePicker: {
			width: '80%',
			backgroundColor: 'white',
			padding: 10,
			borderRadius: 5,
			marginBottom: 10,
			alignItems: 'center',
		},
		datePickerText: {
			color: '#000',
			fontSize: 16,
			textAlign: 'center',
		},
		
	
    
});
