import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {logoutUser} from "../api/auth";
import {AccessToken, deleteToken} from "../util/token";
import { AuthContext } from '../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Popup from './Popup';

const Logout = () => {

    const { userToken, setUserToken } = useContext(AuthContext);
    const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
    const userId = decodedToken ? decodedToken.user_id : null;
    const [confirmVisible, setConfirmVisible] = useState(false);

    const doLogout = async () => {
        if (!userId) {
            console.log("No user ID available for logout.");
            return;
        }

        try {
            await logoutUser(userId)
            await deleteToken('accessToken');
            setUserToken(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setConfirmVisible(true)} style={styles.logoutButton}>
                <MaterialIcons name="logout" size={22} color="black" />
            </TouchableOpacity>
            <Popup
                isVisible={confirmVisible}
                message={"Are you sure you want to log out?"}
                onClose={() => setConfirmVisible(false)}
                buttons={[{ label: 'Cancel', onPress: () => setConfirmVisible(false), backgroundColor: '#777' }, { label: 'Yes', onPress: doLogout, backgroundColor: '#d9534f' }]}
            />
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
