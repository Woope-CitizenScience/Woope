/*
    !! IMPLEMENT IMAGE_PATH
*/

import React, {useState} from "react";
import { Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text, FlatList} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { createUserEvents } from "../api/event";

interface EventInfo {
    name: string;
    tagline: string;
    description: string;
    time_begin: Date;
    time_end: Date;
}
interface ModalProps {
    user_id: number,
    isVisible: boolean,
    onClose: () => void,
}

const CreateUserEvent: React.FC<ModalProps> = ({user_id, isVisible, onClose}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [newInfo, setNewInfo] = useState<EventInfo>({
        name: "",
        tagline: "",
        description: "",
        time_begin: new Date(),
        time_end: new Date(),
        })

    const handleSave = async () => {
        try {
            const response = await createUserEvents(user_id, newInfo.name, newInfo.tagline, newInfo.description, startDate, endDate)
        } catch (error) {
            console.log('Update Failed', error);
        }
    }
    
    const showMode = () => {
        setShow(true);
    };

    const handleInputChange = (field: keyof EventInfo, value: string) => {
        setNewInfo(prevState => ({ ...prevState, [field]: value }));
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
                    <Text>Enter a name</Text>
                    <TextInput 
                    onChangeText={(value) => handleInputChange("name", value)}
                    maxLength={20}
                    style = {styles.textbox}
                    ></TextInput>
                    <Text>Enter a tagline </Text>
                    <TextInput 
                    onChangeText={(value) => handleInputChange("tagline", value)}
                    maxLength={50}
                    style = {styles.textbox}
                    ></TextInput>
                    <Text>Enter a description</Text>
                    <TextInput 
                    onChangeText={(value) => handleInputChange("description", value)}
                    maxLength={500}
                    multiline={true}
                    scrollEnabled={true}
                    style = {styles.textbox}
                    ></TextInput>
                    <View style={styles.dateContainer}>
                        <Button onPress={showMode} title="Enter Start Date" />
                        <DateTimePicker
                            value={startDate}
                            mode={"datetime"}
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate;
                                setShow(false);
                                setStartDate(currentDate!);
                                }}
                        />
                        
                    </View>
                    <View style={styles.dateContainer}>
                        <Button onPress={showMode} title="Enter End Time"/>
                        <DateTimePicker
                            value={endDate}
                            mode={"time"}
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate;
                                setShow(false);
                                setEndDate(currentDate!);
                                }}
                        />
                    </View>
                </View>
                <View style = {styles.buttonContainer}>
                    <Button 
                    title="Cancel"
                    onPress= {onClose}
                    />
                    <Button 
                    title="Create"
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
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    textContainer: {
        flexDirection: "column",
        gap: 10,
    },
    buttonContainer: {
        marginTop: 30,
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
    dateContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
})
export default CreateUserEvent;