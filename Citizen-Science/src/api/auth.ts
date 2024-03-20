
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

	return await response.json();
}

export const registerUser = async (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => {
	const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, phoneNumber, password, firstName, lastName }),
	});

	if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}

	return await response.json();
}

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
}
