/*
    Modal component to edit the organization info from the organization card
    Takes the organization name, whether its visible, and a function when it closes
*/
import React, {useState} from "react";
import {Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text} from "react-native";
import { setFeatured } from "../api/organizations";
import { getOrganizationByName } from "../api/organizations";
import Popup from "./Popup";
import { Organization } from "../api/types";

interface OrganizationInfo {
    name: string
}
interface ModalProps {
    isVisible: boolean,
    onClose: () => void,
}
const FeatureModal: React.FC<ModalProps> = ({isVisible, onClose}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isValid, setIsValid ] = useState(false);
    const [orgName, setOrgName] = useState<Organization[]>();
    const showPopup = (messages: string[]) => {
		const formattedMessages = messages.map(message => `\u2022 ${message}`).join('\n');
		setPopupMessage(formattedMessages);
		setIsPopupVisible(true);
	};
    //TODO: validate input, if already featured popup, if name is not in db popup, if invalid syntax popup
    const handleSave = async () => {
            try {
                const response = await setFeatured(name.name);
            } catch (error) {
                console.log('Feature Failed', error);
                showPopup(['Error Featuring Group'])
            }
    }
    const [name, setName] = useState<OrganizationInfo>({
            name: ''
        })
    const handleInputChange = (field: keyof OrganizationInfo, value: string) => {
        setName(prevState => ({ ...prevState, [field]: value }));
    };
    return(
        <SafeAreaView style = {styles.safeview}>
            <Modal 
            transparent = {true}
            animationType="fade"
            visible = {isVisible} 
            onRequestClose={onClose}
            > 
            <View style = {styles.container}>
                <View style = {styles.textContainer}>
                    <Text>Enter the name of the group to feature</Text>
                    <TextInput 
                    onChangeText={(value) => handleInputChange("name", value)}
                    maxLength={50}
                    style = {styles.textbox}
                    ></TextInput>
                </View>
                <View style = {styles.buttonContainer}>
                    <Button 
                    title="Cancel"
                    onPress= {onClose}
                    />
                    <Button 
                    title="Update"
                    onPress = {() => {
                        handleSave();
                        onClose();
                    }}/>
                </View>
            </View>
            </Modal>
            <Popup isVisible = {isPopupVisible} message = {popupMessage} onClose={() => setIsPopupVisible(false)}/>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeview: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    textContainer: {
        flexDirection: "column",
        gap: 10,
    },
    buttonContainer: {
        gap: 30,
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    textbox:{
        padding: 10,
        width: 300,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "lightblue",
        backgroundColor: "white"
    },
})
export default FeatureModal;