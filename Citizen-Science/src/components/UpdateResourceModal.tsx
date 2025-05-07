/*
    Modal component to edit the resource info from the resource card
    Takes the resource name, whether its visible, and a function when it closes
*/
import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { updateResource, updateResourcePhoto } from "../api/resources";
import * as ImagePicker from "expo-image-picker";
import { submitForm } from "../api/upload";
interface ResourceInfo {
    tagline: string;
    description: string;
}
interface ModalProps {
    resource_id: number,
    isVisible: boolean,
    onClose: () => void,
}
interface ImageInfo {
    name: string;
    uri: string;
}
const UpdateResourceModal: React.FC<ModalProps> = ({ resource_id, isVisible, onClose }) => {
    const [newInfo, setNewInfo] = useState<ResourceInfo>({
        tagline: "",
        description: "",
    });
    const [imageInfo, setImageInfo] = useState<ImageInfo>({
        name: "",
        uri: "",
    });

    const handleInputChange = (field: keyof ResourceInfo, value: string) => {
        setNewInfo(prevState => ({ ...prevState, [field]: value }));
    };

    // allows selection of image, and retrieval of its data
    const selectImage = async () => {
        try {
            // request permissions to image library on iphone
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            // only allow images
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [18, 6],
                quality: 1,
            });
            // if not cancelled
            if (!result.canceled) {
                //retrieve selected image
                const file = result.assets[0];
                // set image info to append to form data once submit is pressed
                setImageInfo({
                    name: Date.now() + '--' + file.fileName,
                    uri: file.uri,
                });
            } else {
                console.log("Document selection cancelled.");
            }
        } catch (error) {
            console.log('Photo upload failed', error);
        }
    }
    // uploads photo to backend server
    const uploadPhoto = () => {
        const formData = new FormData();
        formData.append("file", imageInfo as any, imageInfo.name);
        return new Promise((resolve, reject) => {
            submitForm("file", formData, (response: any) => {
                if (response === "error") {
                    reject(new Error("Upload failed"));
                } else {
                    resolve(response);
                }
            });
        });
    };
    // uploads photo name to database
    const uploadPhotoName = async () => {
        try {
            const response = await updateResourcePhoto(resource_id, imageInfo.name.toString());
        } catch (error) {
            console.log('Error', error);
        }
    }
    // updates organization info to database
    const updateInfo = async () => {
        try {
            // update new info to database
            const response = await updateResource(resource_id, newInfo.tagline, newInfo.description);
        } catch (error) {
            console.log('Resource Info Update Failed', error);
        }
    }
    return (
        <SafeAreaView style={styles.safeview}>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text>Enter A New Tagline</Text>
                        <TextInput
                            onChangeText={(value) => handleInputChange("tagline", value)}
                            maxLength={50}
                            style={styles.textbox}
                        ></TextInput>
                        <Text>Enter A New Description</Text>
                        <TextInput
                            onChangeText={(value) => handleInputChange("description", value)}
                            maxLength={500}
                            multiline={true}
                            scrollEnabled={true}
                            style={styles.textbox}
                        ></TextInput>
                        <View>
                            <Text>Change the banner image</Text>
                            <TouchableOpacity onPress={() => selectImage()}>
                                <MaterialIcons name="add-photo-alternate" size={30} color={"lightblue"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Close"
                            onPress={onClose}
                        />
                        <Button 
                            title="Save"
                            onPress = { () => {
                                if((newInfo.description || newInfo.tagline) && imageInfo.name != ""){
                                    Promise.all([updateInfo(), uploadPhoto(), uploadPhotoName()]).then((values) => {
                                        setNewInfo({
                                            tagline: "",
                                            description: "",
                                        })
                                        setImageInfo({ 
                                            name: "",
                                            uri: "",
                                        })
                                        onClose();
                                    })
                                }
                                else if(imageInfo.name != "" && (!newInfo.description && !newInfo.description)){
                                Promise.all([uploadPhoto(), uploadPhotoName()]).then((values) => {
                                        setImageInfo({ 
                                            name: "",
                                            uri: "",
                                        })
                                        onClose();
                                    })
                                }
                                else{
                                    Promise.all([updateInfo()]).then((values) => {
                                        setNewInfo({
                                            tagline: "",
                                            description: "",
                                        })
                                        onClose();
                                    })
                                }
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
    textbox: {
        padding: 10,
        width: 300,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "lightblue",
        backgroundColor: "white"
    },
})
export default UpdateResourceModal;