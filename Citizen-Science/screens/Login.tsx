import React, {useEffect} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {auth} from "../firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {useNavigation} from "@react-navigation/native";

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const navigator = useNavigation();

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            if (user) {
                navigator.navigate("Home");
            } else {
                console.log("User logged out");
            }
        });
    }, []);

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View>
                <TextInput placeholder={"Email"}
                           value={email}
                           onChangeText={text => setEmail(text) }
                           style={styles.input}
                />
                <TextInput placeholder={"Password"}
                           value={password}
                           onChangeText={text => setPassword(text) }
                           style={styles.input}
                           secureTextEntry={true}
                    />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ handleSignUp }
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 8,
        margin: 10,
        width: 200,
    },
    buttonContainer: {
        width: 200,
    },
    button: {
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    buttonOutline: {
        backgroundColor: "#fff",
        borderColor: "#000",
        borderWidth: 2,
    },
    buttonOutlineText: {
        color: "#000",
        textAlign: "center",
        fontWeight: "bold",
    },
});
