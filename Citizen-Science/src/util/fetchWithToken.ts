import { RequestInfo } from "undici-types";
import { deleteToken, getToken, storeToken } from "./token";
import { Alert } from "react-native";

interface Options {
	headers?: Record<string, string>;
}

interface FetchWithTokenResponse {
	response: Response;
	newAccessToken?: string;
	tokenRefreshFailed?: boolean;
}

export const refreshAccessToken = async (setUserToken: (val: string | null) => void) => {
	try {
		const refreshTokenValue = await getToken("refreshToken");

		const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-access-token`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken: refreshTokenValue }),
		});

		const data = await response.json();

		if (response.ok) {
			await storeToken("accessToken", data.accessToken);
			return data.accessToken;
		} else {
			// Refresh token is invalid or expired
			await deleteToken("accessToken");
			await deleteToken("refreshToken");
			Alert.alert(
				"Session Expired",
				"Your session has ended. Please log in again.",
				[{ text: "OK" }]
			);
			setUserToken(null); // Triggers logout
		}
	} catch (error) {
		console.error("Error refreshing token:", error);
	}
};

export const fetchWithToken = async (
	url: RequestInfo,
	options: Options = {},
	setUserToken?: (val: string | null) => void
): Promise<FetchWithTokenResponse> => {
	let accessToken = await getToken("accessToken");

	if (!options.headers) {
		options.headers = {};
	}
	options.headers["Authorization"] = `Bearer ${accessToken}`;

	let response = await fetch(url, options);

	if (response.status === 401 && setUserToken) {
		accessToken = await refreshAccessToken(setUserToken);
		if (accessToken) {
			options.headers["Authorization"] = `Bearer ${accessToken}`;
			response = await fetch(url, options);
			return { response, newAccessToken: accessToken };
		} else {
			return { response, tokenRefreshFailed: true };
		}
	}

	return { response };
};
