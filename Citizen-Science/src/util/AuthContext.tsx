import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {getToken} from "./token";
import {refreshAccessToken} from "./fetchWithToken";

interface AuthContextType {
	userToken: string | null;
	setUserToken: (token: string | null) => void;
}

const defaultAuthContextValue: AuthContextType = {
	userToken: null,
	setUserToken: () => {
	},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
	const [userToken, setUserToken] = useState<string | null>(null);

	useEffect(() => {
		const verifyToken = async () => {
			try {
				const token = await getToken('accessToken');
				if (token) {
					const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-access-token`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({accessToken: token}),
					});

					if (response.ok) {
						setUserToken(token);
					} else {
						// Attempt to refresh the access token
						const refreshToken = await getToken('refreshToken');
						if (refreshToken) {
							const refreshedAccessToken = await refreshAccessToken();

							if (refreshedAccessToken) {
								setUserToken(refreshedAccessToken);
							} else {
								// Handle refresh token invalidity
								console.error('Refresh token invalid or expired:');
								// Potentially redirect to login or clear tokens
							}
						}
					}
				}
			} catch (error) {
				console.error('Error verifying token:', error);
			}
		};

		verifyToken();
	}, [setUserToken]);

	return (
		<AuthContext.Provider value={{userToken, setUserToken}}>
			{children}
		</AuthContext.Provider>
	);
};
