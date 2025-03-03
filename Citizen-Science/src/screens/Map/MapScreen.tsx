import React, { useState, useEffect, useRef } from 'react';
import { createPinNew, getAllPinsNew, deletePinNew, updatePinNew } from '../../api/pins';

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
	Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as MediaLibrary from 'expo-media-library';
import test from 'node:test';

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
	pin_id: number; // Added pin_id for delete and update
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
	const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState<{
		name: string;
		date: string;
		description: string;
		tag: string;
		image: string | null; // Allow both string and null
		location: { latitude: number; longitude: number } | null;
	}>({
		name: '',
		date: '',
		description: '',
		tag: 'General',
		image: null,
		location: null,
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


	// Fetching Pins

	const fetchPins = async () => {
		try {
			const allPins = await getAllPinsNew();
			// console.log('\nFetched pins from the server:', allPins); // We do get the pin_id

			// Confirmed correct format
			const transformedPins = allPins.map((pin) => ({
				pin_id: pin.pin_id,
				name: pin.name,
				date: new Date(pin.datebegin).toISOString().split('T')[0],
				description: pin.text_description,
				tag: pin.label,
				image: null, // Assuming no image is provided in the data
				location: {
					//   latitude: pin.latitude,
					//   longitude: pin.longitude,
					latitude: pin.longitude,
					longitude: pin.latitude,
				},
			}));

			// console.log('\nTransformed Pins:', transformedPins);

			setPins([...transformedPins]); // Spread operator ensures a new array
			setFilteredPins([...transformedPins]);

			//console.log('\nPins (from setPins) : ', pins)
			//console.log("\nFiltered Pins (from setFilteredPins):", filteredPins)

			return transformedPins;

		} catch (error) {
			console.error('Error fetching all pins:', error);
		}
	};

	// If fetchPins runs before the map is fully initialized, the pins might not render.
	useEffect(() => {
		if (initialRegion) {
			fetchPins();
		}
	}, [initialRegion]);

	useEffect(() => {
		fetchPins().then((pins) => {
			//console.log(pins); // Access the resolved array
		});
	}, []);

	useEffect(() => {
		//console.log('\nUpdated Pins:', pins);
		//console.log('\nUpdated Filtered Pins:', filteredPins);
	}, [pins, filteredPins]);

	// End Fetch Pins

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
		setIsEditMode(false);
		setModalVisible(true); // Show the form modal
	};

	const closeDetailsModal = () => {
		setSelectedPin(null); // Clear the selected pin
		setDetailsVisible(false); // Close the details modal
		isMarkerPressedRef.current = false; // Reset the flag
		setIsMarkerPressed(false); // Reset marker pressed state
	};

	const handleDeletePin = (pinId: number) => {
		deletePinNew(pinId)
			.then(() => {
				console.log('Pin deleted successfully!');
			})
	};


	const handleFormSubmit = async () => {
		if (!formData.name || !formData.date || !formData.description || !formData.tag) {
			alert('Please fill out all fields before submitting.');
			return;
		}

		const pinLocation = formData.location || formLocation;
		if (!pinLocation) {
			alert('No location available for this pin');
			return;
		}

		// ✅ Create FormData
		const newFormData = new FormData();
		newFormData.append("name", formData.name);
		newFormData.append("description", formData.description);
		newFormData.append("date", formData.date);
		newFormData.append("tag", formData.tag);
		newFormData.append("latitude", pinLocation.latitude.toString());
		newFormData.append("longitude", pinLocation.longitude.toString());

		// ✅ Ensure Image is Added to FormData
		if (formData.image) {
			let localUri = formData.image;
			let fileType = localUri.split('.').pop();
			newFormData.append("file", {
				uri: localUri,
				name: `photo.${fileType}`,
				type: `image/${fileType}`,
			});
		}

		try {
			console.log("📤 Sending FormData to Backend...", newFormData);

			const response = await fetch("http://localhost:3000/pinnew", {
				method: "POST",
				body: newFormData, // No need to manually set headers, `fetch` handles `multipart/form-data`
			});

			const responseText = await response.text(); // Capture raw response
			console.log("🔍 Raw Response:", responseText);

			if (!response.ok) {
				throw new Error(`Server error: ${response.status}`);
			}

			const jsonResponse = JSON.parse(responseText);
			console.log("✅ Parsed Response:", jsonResponse);
			alert("Pin created successfully!");
		} catch (error) {
			console.error("❌ Error creating pin:", error);
			alert("Failed to create the pin. Please try again.");
		}
	};



	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
			exif: true, // Ensure EXIF data is included
		});

		if (!result.canceled) {
			const imageUri = result.assets[0].uri;
			console.log('Image URI:', imageUri);

			// Check for EXIF data
			const exifData = result.assets[0].exif;
			if (exifData && exifData.GPSLatitude && exifData.GPSLongitude) {
				let latitude = exifData.GPSLatitude;
				let longitude = exifData.GPSLongitude;

				// Adjust based on hemisphere reference
				if (exifData.GPSLatitudeRef === 'S') {
					latitude = -latitude; // Southern hemisphere
				}
				if (exifData.GPSLongitudeRef === 'W') {
					longitude = -longitude; // Western hemisphere
				}

				console.log(`Geolocation found: Latitude: ${latitude}, Longitude: ${longitude}`);

				// Save location and image in state
				setFormData((prev) => ({
					...prev,
					image: imageUri,
					location: { latitude, longitude }, // Save location to form data
				}));
			} else {
				// Handle the case where no geolocation is found
				Alert.alert(
					'No Geolocation Found',
					'This image does not contain geolocation data. Would you still like to use it?',
					[
						{
							text: 'Cancel',
							onPress: () => console.log('User canceled'),
							style: 'cancel',
						},
						{
							text: 'Yes',
							onPress: () => {
								// Save only the image without geolocation
								setFormData((prev) => ({
									...prev,
									image: imageUri,
									location: null, // No location data available
								}));
							},
						},
					]
				);
			}
		}
	};


	const resetModals = () => {
		setModalVisible(false);
		setDetailsVisible(false);
		setSelectedPin(null);
		setFormLocation(null);
	};

	//handle camera button's action
	const handleOpenCamera = async () => {
		// Request camera permission
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			alert('Camera permission is required to take a picture.');
			return;
		}

		// Request location permission
		const locationPermission = await Location.requestForegroundPermissionsAsync();
		if (locationPermission.status !== 'granted') {
			alert('Location permission is required to capture geolocation.');
			return;
		}

		// Launch the camera
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
			exif: true, // EXIF data might not include geolocation
		});

		if (!result.canceled) {
			const imageUri = result.assets[0].uri;
			console.log('Captured Image URI:', imageUri);

			// Fetch current location
			const location = await Location.getCurrentPositionAsync({});
			const latitude = location.coords.latitude;
			const longitude = location.coords.longitude;

			console.log(`Manual Geolocation: Latitude: ${latitude}, Longitude: ${longitude}`);

			// Prompt user to use the captured location
			Alert.alert(
				'Use Current Location',
				'The camera does not include geolocation in the image. Would you like to use your current location instead?',
				[
					{
						text: 'No',
						onPress: () => {
							// Save the image without geolocation
							setFormData((prev) => ({
								...prev,
								image: imageUri,
								location: null, // No location
							}));
							console.log('User chose not to use current location');
						},
					},
					{
						text: 'Yes',
						onPress: () => {
							// Save image with the current location
							setFormData((prev) => ({
								...prev,
								image: imageUri,
								location: { latitude, longitude }, // Use current location
							}));
							console.log('User chose to use current location');
						},
					},
				]
			);
		}
	};


	const handleEditPin = () => {
		if (selectedPin) {
			setFormData({
				name: selectedPin.name,
				date: selectedPin.date,
				description: selectedPin.description,
				tag: selectedPin.tag,
				image: selectedPin.image,
				location: selectedPin.location,
			});
			setIsEditMode(true); // Switch to update mode
			setModalVisible(true); // Open the modal with pre-filled data
		}
	};

	const handlePinUpdateFormSubmit = async () => {

		// Validate form before submission
		if (!formData.name || !formData.date || !formData.description || !formData.tag) {
			alert('Please fill out all fields before submitting.');
			return;
		}

		const pinLocation = formData.location || formLocation;

		if (!pinLocation) {
			alert('No location available for this pin');
			return;
		}

		try {
			// Call the API to update the pin in the database (assume updatePinNew exists)
			const updatedPin = await updatePinNew(
				selectedPin.pin_id, // Use the pin ID of the selected pin
				formData.name,
				formData.description,
				new Date(formData.date),
				formData.tag,
				pinLocation.latitude,
				pinLocation.longitude
			);

			// Ensure date parsing is valid
			if (updatedPin.datebegin) {
				updatedPin.date = new Date(updatedPin.datebegin).toISOString().split('T')[0]; // Format date correctly
			}


			console.log('Response from updatePinNew:', updatedPin);

			// Update the pin in the frontend state
			setPins((prev) =>
				prev.map((pin) =>
					pin.pin_id === updatedPin.pin_id
						? {
							...pin,
							name: updatedPin.name,
							date: updatedPin.date,
							description: updatedPin.description,
							tag: updatedPin.tag,
							location: {
								latitude: updatedPin.latitude,
								longitude: updatedPin.longitude,
							},
						}
						: pin
				)
			);

			// Reset the form and hide the modal
			setFormData({ name: '', date: '', description: '', tag: 'General', image: null, location: null });
			setFormLocation(null);
			setModalVisible(false);
			closeDetailsModal();
			fetchPins();

			alert('Pin updated successfully!');
		} catch (error) {
			console.error('Error updating pin:', error);
			alert('Failed to update the pin. Please try again.');
		}
	};



	// HTML
	return (
		<View style={styles.container}>

			{/* Map */}
			{initialRegion && (
				<MapView
					key={filteredPins.map((pin) => pin.name).join('-')} // Generate a unique key
					style={styles.map}
					initialRegion={initialRegion}
					onPress={handleMapPress}
					showsUserLocation
					showsMyLocationButton
					showsCompass
				>

					{/* Render existing pins */}
					{/*console.log('!!!!Contents of filteredPins:', filteredPins)*/}
					{filteredPins.map((pin) => {
						//console.log('Rendering Marker:', pin); // Log each pin being rendered
						return (
							<Marker
								key={`${pin.name}-${pin.location.latitude}-${pin.location.longitude}`}
								coordinate={pin.location}
								title={pin.name}
								description={pin.description}
								onPress={() => handleMarkerPress(pin)} // Handle marker press for viewing pin
							>
								{/* Render the pin's image if it exists */}
								{pin.image && (
									<Image
										source={{ uri: pin.image }}
										style={{ width: 50, height: 50, borderRadius: 25 }}
									/>
								)}
							</Marker>
						);
					})}

					{/* Render a pin for the photo's geolocation if available */}
					{formData.location && (
						<Marker
							coordinate={{
								latitude: formData.location.latitude,
								longitude: formData.location.longitude,
							}}
							title="Photo Location"
							description="Location where this photo was taken"
						>
							{formData.image && (
								<Image
									source={{ uri: formData.image }}
									style={{ width: 50, height: 50, borderRadius: 25 }}
								/>
							)}
						</Marker>
					)}

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
					<Text style={styles.modalTitle}>
						{isEditMode ? 'Update Pin' : 'Add a New Pin'}
					</Text>
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

					<TouchableOpacity style={styles.cameraButton} onPress={handleOpenCamera}>
						<Text style={styles.cameraButtonText}>Open Camera</Text>
					</TouchableOpacity>
					{formData.image && (
						<Image
							source={{ uri: formData.image }}
							style={{ width: 100, height: 100, marginTop: 10 }}
						/>
					)}


					{/* Action Buttons */}
					<View style={styles.buttonContainer}>

						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => {
								setFormData({
									name: '',
									date: '',
									description: '',
									tag: 'General',
									image: null,
									location: null
								}); // Clear form data
								setModalVisible(false); // Close the modal
							}}
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>


						<TouchableOpacity
							style={styles.submitButton}
							onPress={isEditMode ? handlePinUpdateFormSubmit : handleFormSubmit}
						>
							<Text style={styles.buttonText}>{isEditMode ? 'Update' : 'Submit'}</Text>
						</TouchableOpacity>

					</View>
				</View>
			</Modal>
			{/* Modal for Viewing Pin Details */}
			<Modal visible={detailsVisible} animationType="slide" transparent={true}>
				<View style={styles.detailsContainer}>
					<View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

						<TouchableOpacity
							style={[styles.closeButton, { marginRight: 20 }]}

							onPress={async () => {
								console.log('Selected Pin for deletion:', selectedPin.pin_id); // Debug log
								await handleDeletePin(selectedPin.pin_id); // Ensure deletion is complete
								closeDetailsModal(); // Close modal immediately after deletion
								setTimeout(() => {
									fetchPins(); // Refresh pins with a slight delay to ensure backend updates
								}, 200); // Adjust delay as needed
								alert('Pin deleted successfully!');
							}}

						>
							<Text style={styles.deleteButtonText}>Delete</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.closeButton, { marginRight: 20 }]}
							//onPress={closeDetailsModal} // Close the modal
							onPress={() => {
								handleEditPin();
							}}

						>
							<Text style={styles.closeButtonText}>Edit</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.closeButton}
							onPress={closeDetailsModal} // Close the modal
						>
							<Text style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
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

// CSS
const styles = StyleSheet.create({
	cameraButton: {
		backgroundColor: '#007AFF',
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
		alignItems: 'center',
	},
	cameraButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
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
	deleteButtonText: {
		color: '#FF0000',
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