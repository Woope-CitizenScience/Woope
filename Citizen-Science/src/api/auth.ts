import AsyncStorage from "@react-native-async-storage/async-storage";

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

	// Store token in AsyncStorage
	if (data?.accessToken) {
		await AsyncStorage.setItem("accessToken", data.accessToken);
		console.log(" Access token stored (login).");
	} else {
		console.warn(" No access token in login response.");
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

	//  Store token in AsyncStorage
	if (data?.accessToken) {
		await AsyncStorage.setItem("accessToken", data.accessToken);
		console.log(" Access token stored (register).");
	} else {
		console.warn(" No access token in register response.");
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

	// Clear token from AsyncStorage
	await AsyncStorage.removeItem("accessToken");
	console.log("👋 Access token removed (logout).");
};
