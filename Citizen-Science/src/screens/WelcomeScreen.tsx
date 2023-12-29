import React from 'react';
import {Button, SafeAreaView, Text} from "react-native";

{/*TODO: using type:any is not reccomended for ts however code gets too complicated if we do not use it*/}
const WelcomeScreen = ({navigation}: {navigation: any}) => {
    return(
        <SafeAreaView>
            <Text style={null}>Welcome to Woope!</Text>
            {/* TODO: Instead of using buttons we will use View tags and treat them as buttons*/}
            <Button
                title={"Login"}
                onPress={() => navigation.navigate('Login')}
            />
            <Button
                title={"Signup"}
                onPress={() => navigation.navigate('Signup')}
            />
        </SafeAreaView>
        )
};
export default WelcomeScreen;