import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {logoutUser} from "../api/auth";
import {AccessToken, deleteToken} from "../util/token";
import { AuthContext } from '../util/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Logout = () => {

    const { userToken, setUserToken } = useContext(AuthContext);
    const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
    const userId = decodedToken ? decodedToken.user_id : null;
    const handleLogout = async () => {
        if (!userId) {
            console.log("No user ID available for logout.");
            return;
        }

        try {
            const response = await logoutUser(userId)

            await deleteToken('accessToken');
            setUserToken(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <MaterialIcons name="logout" size={22} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D1E3FA',
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    logoutButton: {
        padding: 5,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
});

export default Logout;