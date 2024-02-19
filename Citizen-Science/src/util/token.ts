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
export const storeToken = async (key: string, value: any) => {
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

export const deleteToken = async (key: string) => {
	try {
		await SecureStore.deleteItemAsync(key);
	} catch (error) {
		console.error('Error deleting the auth token', error);
	}
}
