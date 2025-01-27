/*
    Modal component to create resource
*/
import React, {useState} from "react";
import { Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { deleteOrganization } from "../api/organizations";
interface ModalProps {
    isVisible: boolean,
    onClose: () => void,
}
interface ResourceInfo{
    name: string;
}
const DeleteOrganization: React.FC<ModalProps> = ({isVisible, onClose}) => {
    const navigation = useNavigation<any>();
    const [data, setData] = useState<ResourceInfo>({
        name: "",
    })
    const handleSave = async () => {
        try {
            const response = await deleteOrganization(data.name)
        } catch (error) {
            console.log('Delete Failed', error);
        }
    }
    const handleInputChange = (field: keyof ResourceInfo, value: string) => {
        setData(prevState => ({ ...prevState, [field]: value }));
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
                    <Text>Enter the name of the group to delete</Text>
                    <TextInput 
                    onChangeText={(value) => handleInputChange("name", value)}
                    maxLength={20}
                    style = {styles.textbox}
                    ></TextInput>
                </View>
                <View style = {styles.buttonContainer}>
                    <Button 
                    title="Close"
                    onPress= {onClose}
                    />
                    <Button 
                    title="Delete"
                    onPress = {() => {
                        handleSave();
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
    textbox:{
        padding: 10,
        width: 300,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "lightblue",
        backgroundColor: "white"
    },
})
export default DeleteOrganization;