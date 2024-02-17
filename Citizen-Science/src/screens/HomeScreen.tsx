import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import {AccessToken, deleteToken} from "../util/token";
import {logoutUser} from "../api/auth";

const HomeScreen = () => {
	const { userToken, setUserToken } = useContext(AuthContext);
	const [data, setData] = useState(null);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const userId = decodedToken ? decodedToken.user_id : null;

	const handleLogout = async () => {
		if (!userId) {
			console.log("No user ID available for logout.");
			return;
		}

		try {
			const response = await logoutUser(userId)

			await deleteToken('accessToken');
			setUserToken(null);
		} catch (error) {
			console.error('Logout error:', error);
		}
	};


	return (
		<View style={styles.container}>
			<Text style={styles.text}>HomeScreen</Text>
			{data && <Text>{JSON.stringify(data, null, 2)}</Text>}
			<Button title="Logout" onPress={handleLogout} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	text: {
		fontSize: 28,
		color: '#232f46',
		marginBottom: 20,
	},
});

export default HomeScreen;
