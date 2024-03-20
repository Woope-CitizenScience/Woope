import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {fetchWithToken} from '../util/fetchWithToken';
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../util/AuthContext";

const CalendarScreen = () => {
	const isFocused = useIsFocused();
	const { userToken, setUserToken } = useContext(AuthContext);
	// testing fetchWithToken
	useEffect(() => {
		if (isFocused) {
			const fetchData = async () => {
				const { response, newAccessToken, tokenRefreshFailed } = await fetchWithToken(`${process.env.EXPO_PUBLIC_API_URL}/health/protected-route`);
				if (newAccessToken && newAccessToken !== userToken) {
					setUserToken(newAccessToken);
				} else if (tokenRefreshFailed) {
					setUserToken(null);
				}
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
