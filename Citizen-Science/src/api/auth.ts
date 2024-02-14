export const loginUser = async (email: string, password: string) => {
	const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	return await response.json();
}

export const registerUser = async (email: string, phoneNumber: string, password: string, firstName: string, lastName: string) => {
	const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, phoneNumber, password, firstName, lastName }),
	});

	return await response.json();
}