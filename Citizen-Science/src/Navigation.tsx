import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
    return(
        <Stack.Navigator initialRouteName={"Welcome"}>
            <Stack.Screen name="Welcome" component={WelcomeScreen}/>
        </Stack.Navigator>
    );
};

export default AppNavigation;