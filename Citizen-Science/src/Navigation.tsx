import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './util/AuthContext';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import SplashScreen from "./screens/SplashScreen";
import NavigationBar from "./components/NavigationBar";
import DateScreen from './screens/Calendar/DateScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
	const { userToken } = useContext(AuthContext);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	// Simulate a splash screen delay or initial loading process
	useEffect(() => {
		setTimeout(() => {
			setIsInitialLoading(false);
		}, 1000); // Adjust time as needed
	}, []);

	if (isInitialLoading) {
		// Show splash screen while loading
		return <SplashScreen />;
	}

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			
			{userToken ? (
				// User authentication/login is successful
				<>
					{/* View  components/navigationbar to see the rest of the screens, nested under their respective bottom tabs*/}
					<Stack.Screen name="NavigationBar" component={NavigationBar} />
					<Stack.Screen name="DateScreen" component={DateScreen}/> 

				</>

			) : (
				// No token found, user is not signed in
				<>
					<Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade' }} />
					<Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_bottom' }} />
					<Stack.Screen name="Signup" component={SignupScreen} options={{ animation: 'slide_from_bottom' }} />
				</>
			)}
		</Stack.Navigator>
	);
};

export default AppNavigation;
