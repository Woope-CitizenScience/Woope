import * as SecureStore from 'expo-secure-store';

export interface AccessToken {
	exp: number;
	iat: number;
	firstName: string;
	lastName: string;
	is_Admin: boolean;
	user_id: number;
	phoneNumber: string;
}
export interface RefreshToken {
	exp: number;
	iat: number;
	user_id: number;
}
export const storeToken = async (key: string, value: string) => {
	try {
		await SecureStore.setItemAsync(key, value);
	} catch (error) {
		console.error('Error storing the auth token', error);
	}
};

export const getToken = async (key: string) => {
	try {
		return await SecureStore.getItemAsync(key);
	} catch (error) {
		console.error('Error getting the auth token', error);
		return null;
	}
};
