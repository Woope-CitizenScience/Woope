/*
    Modal component to edit the event info from the event card
    Takes the name, whether its visible, and a function when it closes
*/
import React, {useState, useEffect} from "react";
import { Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text} from "react-native";
import { updateEvent } from "../api/event";
import DateTimePicker from '@react-native-community/datetimepicker';

interface EventInfo {
    tagline: string;
    description: string;
}
interface ModalProps {
    event_id: number,
    time_begin: Date,
    time_end: Date,
    tagline: string,
    text_description: string,
    isVisible: boolean,
    onClose: () => void,
}
const UpdateEventModal: React.FC<ModalProps> = ({event_id, isVisible, onClose, time_begin, time_end, tagline, text_description}) => {
    const [startDate, setStartDate] = useState(time_begin);
    const [endDate, setEndDate] = useState(time_end);
    const [show, setShow] = useState(false);
    const handleSave = async () => {
        try {
            const response = await updateEvent(event_id, newInfo.tagline, newInfo.description, startDate, endDate)
        } catch (error) {
            console.log('Update Failed', error);
        }
    }
    const showMode = () => {
        setShow(true);
        };
    const [newInfo, setNewInfo] = useState<EventInfo>({
            tagline: "",
            description: "",
        })
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
                    <Text>Edit Tagline</Text>
                        <TextInput 
                        onChangeText={(value) => handleInputChange("tagline", value)}
                        maxLength={50}
                        placeholder={tagline}
                        style = {styles.textbox}
                        ></TextInput>
                    <Text>Edit Description</Text>
                        <TextInput 
                        onChangeText={(value) => handleInputChange("description", value)}
                        maxLength={500}
                        multiline={true}
                        scrollEnabled={true}
                        placeholder={text_description}
                        style = {styles.textbox}
                        ></TextInput>
                    <View style={styles.dateContainer}>
                        <Button onPress={showMode} title="Edit Start Date" />
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
                        <Button onPress={showMode} title="Edit End Time"/>
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
    dateContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
})
export default UpdateEventModal;