import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {getToken} from "./token";

interface AuthContextType {
	userToken: string | null;
	setUserToken: (token: string | null) => void;
}

const defaultAuthContextValue: AuthContextType = {
	userToken: null,
	setUserToken: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [userToken, setUserToken] = useState<string | null>(null);

	useEffect(() => {
		getToken('accessToken').then(token => {
			if (token) {
				setUserToken(token);
			}
		});
	}, []);

	return (
		<AuthContext.Provider value={{ userToken, setUserToken }}>
			{children}
		</AuthContext.Provider>
	);
};
