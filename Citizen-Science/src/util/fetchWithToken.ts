import { RequestInfo } from "undici-types";
import {deleteToken, getToken, storeToken} from "./token";

interface Options {
	headers?: Record<string, string>;
}
const refreshToken = async () => {
	try {
		const refreshTokenValue = await getToken('refreshToken');
		const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/refresh-access-token`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({refreshToken: refreshTokenValue}),
		});
		const data = await response.json();
		if (response.ok) {
			await storeToken('accessToken', data.accessToken);
			return data.accessToken;
		} else {
			// Handle refresh token failure (e.g., redirect to login)
			deleteToken('accessToken');
		}
	} catch (error) {
		console.error('Error refreshing token:', error);
	}
};

export const fetchWithToken = async (url: RequestInfo, options: Options = {}) => {
	let accessToken = await getToken('accessToken');

	// Add the token to the headers
	if (!options.headers) {
		options.headers = {};
	}
	options.headers['Authorization'] = `Bearer ${accessToken}`;

	let response = await fetch(url, options);

	// If access token is expired or invalid
	if (response.status === 401) {
		accessToken = await refreshToken();
		if (accessToken) {
			options.headers['Authorization'] = `Bearer ${accessToken}`;
			response = await fetch(url, options); // Retry the request with the new token
		}
	}

	return response;
};
