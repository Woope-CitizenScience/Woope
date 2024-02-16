import React, {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchWithToken } from '../util/fetchWithToken';

const CalendarScreen = () => {
	// testing fetchWithToken
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetchWithToken(`${process.env.EXPO_PUBLIC_API_URL}/health/protected-route`);
			console.log('data:', await response.text());
		};
		fetchData();
	} , []);
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
