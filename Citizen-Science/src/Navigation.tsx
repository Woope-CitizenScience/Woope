import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import SplashScreen from "./screens/SplashScreen";
import NavigationBar from "./components/NavigationBar";
import HomeScreen from "./screens/HomeScreen";

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
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Splash" component={SplashScreen}/>
            <Stack.Screen
                name="NavigationBar"
                component={NavigationBar}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigation;