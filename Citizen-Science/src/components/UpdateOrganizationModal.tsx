/*
    Modal component to edit the organization info from the organization card
    Takes the organization name, whether its visible, and a function when it closes
*/
import React, {useState} from "react";
import {Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text, TouchableOpacity} from "react-native";
import { MaterialIcons, Octicons, AntDesign } from '@expo/vector-icons';
import { updateOrganization } from "../api/organizations";
import * as ImagePicker from "expo-image-picker";
interface OrganizationInfo {
    tagline: string;
    description: string;
}
interface ModalProps {
    name: string,
    isVisible: boolean,
    onClose: () => void,
}
const UpdateOrganizationModal: React.FC<ModalProps> = ({name, isVisible, onClose}) => {
    const [newInfo, setNewInfo] = useState<OrganizationInfo>({
        tagline: "",
        description: "",
    })
    const handleSave = async () => {
        try {
            const response = await updateOrganization(name, newInfo.tagline, newInfo.description)
        } catch (error) {
            console.log('Update Failed', error);
        }
    }
    const handleInputChange = (field: keyof OrganizationInfo, value: string) => {
		setNewInfo(prevState => ({ ...prevState, [field]: value }));
	};
    const uploadImage = async () => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [18,6],
                quality: 1,
            })
        } catch (error) {
            console.log('Photo upload failed', error);
        }
    }
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
                    <Text>Enter A New Tagline</Text>
                    <TextInput 
                    onChangeText={(value) => handleInputChange("tagline", value)}
                    maxLength={50}
                    style = {styles.textbox}
                    ></TextInput>
                    <Text>Enter A New Description</Text>
                    <TextInput 
                    onChangeText={(value) => handleInputChange("description", value)}
                    maxLength={500}
                    multiline={true}
                    scrollEnabled={true}
                    style = {styles.textbox}
                    ></TextInput>
                    <View>
                        <Text>Change the banner image</Text>
                        <TouchableOpacity onPress={() => uploadImage()}>
                            <MaterialIcons name="add-photo-alternate" size={30} color={"lightblue"}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {styles.buttonContainer}>
                    <Button 
                    title="Close"
                    onPress= {onClose}
                    />
                    <Button 
                    title="Save"
                    onPress = {() => {
                        handleSave();
                        onClose();
                    }}/>
                </View>
            </View>
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeview: {
        flex: 1,
    },
    container: {
        flex: 1,
        gap: 20,
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
export default UpdateOrganizationModal;