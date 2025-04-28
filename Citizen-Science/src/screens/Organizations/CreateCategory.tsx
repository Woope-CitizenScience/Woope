/*
    This screen will allow the user to create organization categories
    ?: convert into a modal component instead?
*/
import React, {useState} from 'react';
import {ImageBackground, SafeAreaView, Platform, KeyboardAvoidingView, Text, StatusBar, StyleSheet, View, TextInput, TouchableOpacity, Keyboard} from "react-native";
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Popup from "../../components/Popup";
import { createOrganization, getOrganizationByName } from '../../api/organizations';
import { Organization } from '../../api/types';

type NavigationParam = {
    Login: undefined;
    Signup: undefined;
    NavigationBar: undefined;
};

interface Errors {
	name?: string;
	tagline?: string;
    textDescription?: string;
}

interface OrganizationInfo {
	name: string;
    tagline: string;
    text_description: string;
}

//Type for our Navigation in our component
type NavigationProp = NativeStackNavigationProp<NavigationParam, 'Signup'>;

export const CreateCategory = () => {
    const navigation = useNavigation<NavigationProp>();
	const [userInfo, setUserInfo] = useState<OrganizationInfo>({
		name: '',
		tagline: '',
		text_description: '',
	});
    const [orgName, setOrgName] = useState<Organization>();
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');

	const showPopup = (messages: string[]) => {
		const formattedMessages = messages.map(message => `\u2022 ${message}`).join('\n');
		setPopupMessage(formattedMessages);
		setIsPopupVisible(true);
	};
	const [errors, setErrors] = useState<Errors>({});
    const fetchName = async(name: string) => {
        try {
            const response = await getOrganizationByName(name);
            setOrgName(response);
        } catch (error) {
            console.log("Organization Does Not Exist")
        }
    }
	const handleInputChange = (field: keyof OrganizationInfo, value: string) => {
		setUserInfo(prevState => ({ ...prevState, [field]: value }));
	};

    const handleSignUpPress = async (name: string) => {
        if (validate(name)) {
            try {
                const response = await createOrganization(userInfo.name,userInfo.tagline,userInfo.text_description);
                showPopup(["Success!"]);
            } catch (error) {
                console.log('Signup failed', error);
                showPopup(["Sign Up Failed"])
            }
        }
    };
	const validate = (name: string): boolean => {
		let newErrors: Errors = {};
		let isValid = true;
		let errorMessages: string[] = [];
        fetchName(name);
        //checks that name is valid 
		if (orgName == undefined) {
			isValid = false;
			errorMessages.push('Group Name Taken');
		}
		setErrors(newErrors);
		if (!isValid) {
			showPopup(errorMessages);
		}
		return isValid;
	};
	return(
        <KeyboardAvoidingView 
        behavior="padding"
        keyboardVerticalOffset={Platform.OS == 'ios' ? 100:0}
        style={styles.container}
        >
            <ImageBackground
                source={require('../../../assets/background2.png')}
                style={styles.image}>
                    <SafeAreaView style={styles.body}>
                            {/* 'Create group' title on signup */}
                            <View style={styles.titlebox}>
                                <Text style={styles.title}> Create {"\n"} Organization</Text>
                            </View>
                            {/* Group name input */}
                            <View style={styles.content}>
                                <Text style={styles.requirements}>Required:</Text>
                                <TextInput
                                style={styles.input}
                                placeholder={"Group Name"}
                                maxLength={20}
                                textAlign='center'
                                onChangeText={(value) => handleInputChange('name', value)}
                                />
                            </View>
                            {/* tagline input */}
                            <View style={styles.content}>
                                <Text style={styles.optional}>Optional:</Text>
                                <TextInput
                                style={styles.input}
                                placeholder={"Optional: One sentence description"}
                                maxLength={50}
                                textAlign='center'
                                onChangeText={(value) => handleInputChange('tagline', value)}
                                />
                            </View>
                            {/* full description input */}
                            <View style={styles.content}>
                                <Text style = {styles.optional}>Optional:</Text>
                                <TextInput
                                style={styles.input}
                                placeholder={"An in-depth Description"}
                                maxLength={500}
                                textAlign='center'
                                // onBlur along with scrollview for dismissal of keyboard without using return button
                                onBlur={() => {
                                    Keyboard.dismiss();
                                }}
                                onChangeText={(value) => handleInputChange('text_description', value)}
                                />
                            </View>
                            {/* Submit button */}
                            <TouchableOpacity style={styles.content} onPress={() => handleSignUpPress(userInfo.name)}>
                                <Text style={styles.label}>Submit</Text>
                            </TouchableOpacity>
                            <Popup
                                isVisible={isPopupVisible}
                                message={popupMessage}
                                onClose={() => setIsPopupVisible(false)}
                            />
                    </SafeAreaView>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        },
    body: {
        flex: 1,
        alignItems:'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    content:{
        margin: 8,
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
    requirements: {
        color: "red",
        fontSize: 14,
        fontWeight: "600"
    },
    optional: {
        color: "black",
        fontSize: 14,
        fontWeight: "600"
    },
    titlebox:{
        marginTop: 30,
        marginBottom: 30,
    },
    input: {
        height: 30,
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    label: {
        color: 'green',
        fontWeight: 'bold',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
    },
});
export default CreateCategory; 