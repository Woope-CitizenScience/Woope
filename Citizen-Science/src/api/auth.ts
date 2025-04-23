import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeToken } from '../util/token';

export const loginUser = async (email: string, password: string) => {
	const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}

	const data = await response.json();

	if (data?.accessToken) {
		await storeToken("accessToken", data.accessToken);
		console.log(" Access token stored (login)");
	}
	if (data?.refreshToken) {
		await storeToken("refreshToken", data.refreshToken);
		console.log(" Refresh token stored (login)");
	}

	return data;
};

export const registerUser = async (
	email: string,
	password: string,
	firstName: string,
	lastName: string,
	dateOfBirth: string,
	phoneNumber?: string
) => {
	const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			phoneNumber,
			password,
			firstName,
			lastName,
			dateOfBirth
		}),
	});

	if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}

	const data = await response.json();

	if (data?.accessToken) {
		await storeToken("accessToken", data.accessToken);
		console.log(" Access token stored (register)");
	}
	if (data?.refreshToken) {
		await storeToken("refreshToken", data.refreshToken);
		console.log(" Refresh token stored (register)");
	}

	return data;
};


export const logoutUser = async (userId: number) => {
	const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	});

	if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}
};
