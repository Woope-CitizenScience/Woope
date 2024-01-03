import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';


const Stack = createNativeStackNavigator();
const AppNavigation = () => {
    return(
        <Stack.Navigator initialRouteName={"Welcome"} screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={WelcomeScreen}/>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen}/>
        </Stack.Navigator>
    );
};

export default AppNavigation;