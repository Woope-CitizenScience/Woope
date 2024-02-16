import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {fetchWithToken} from '../util/fetchWithToken';
import {useIsFocused} from "@react-navigation/native";

const CalendarScreen = () => {
	const isFocused = useIsFocused();
	// testing fetchWithToken
	useEffect(() => {
		if (isFocused) {
			const fetchData = async () => {
				const response = await fetchWithToken(`${process.env.EXPO_PUBLIC_API_URL}/health/protected-route`);
				console.log('data:', await response.text());
			};
			fetchData();
		}
	}, [isFocused]);
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Calendar Screen</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 28,
		color: '#232f46',
	},
});
export default CalendarScreen;
