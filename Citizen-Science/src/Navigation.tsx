import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import SplashScreen from "./screens/SplashScreen";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
    return(
        <Stack.Navigator
            initialRouteName={"Splash"}
            screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{animation: 'fade'}}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{animation: 'slide_from_bottom'}}
            />
            <Stack.Screen name="Signup" component={SignupScreen}/>
            <Stack.Screen name="Splash" component={SplashScreen}/>
        </Stack.Navigator>
    );
};

export default AppNavigation;