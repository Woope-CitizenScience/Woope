import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUserEvents } from "../api/event";

interface EventInfo {
    name: string;
    tagline: string;
    description: string;
    time_begin: Date;
    time_end: Date;
}

interface ModalProps {
    user_id: number;
    isVisible: boolean;
    onClose: () => void;
}

const CreateUserEvent: React.FC<ModalProps> = ({ user_id, isVisible, onClose }) => {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<"start" | "end">("start");
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const [newInfo, setNewInfo] = useState<EventInfo>({
        name: "",
        tagline: "",
        description: "",
        time_begin: new Date(),
        time_end: new Date(),
    });

    const handleSave = async () => {
        try {
            await createUserEvents(user_id, newInfo.name, newInfo.tagline, newInfo.description, startDate, endDate);
        } catch (error) {
            console.log("Update Failed", error);
        }
    };

    const handleInputChange = (field: keyof EventInfo, value: string) => {
        setNewInfo(prevState => ({ ...prevState, [field]: value }));
    };

    const openDatePicker = (target: "start" | "end") => {
        setPickerTarget(target);
        setShowDatePicker(true);
    };

    const onDateSelected = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setTempDate(selectedDate);
            setShowTimePicker(true);
        }
    };

    const onTimeSelected = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const combinedDateTime = new Date(tempDate);
            combinedDateTime.setHours(selectedTime.getHours());
            combinedDateTime.setMinutes(selectedTime.getMinutes());
            combinedDateTime.setSeconds(0);
            combinedDateTime.setMilliseconds(0);

            if (pickerTarget === "start") {
                setStartDate(combinedDateTime);
            } else {
                setEndDate(combinedDateTime);
            }
        }
    };

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
                        <Text>Enter a name</Text>
                        <TextInput
                            onChangeText={(value) => handleInputChange("name", value)}
                            maxLength={20}
                            style={styles.textbox}
                        />
                        <Text>Enter a tagline</Text>
                        <TextInput
                            onChangeText={(value) => handleInputChange("tagline", value)}
                            maxLength={50}
                            style={styles.textbox}
                        />
                        <Text>Enter a description</Text>
                        <TextInput
                            onChangeText={(value) => handleInputChange("description", value)}
                            maxLength={500}
                            multiline={true}
                            scrollEnabled={true}
                            style={[styles.textbox, { height: 100 }]}
                        />

                        <View style={styles.dateContainer}>
                            <Button onPress={() => openDatePicker("start")} title="Select Start Date & Time" />
                            <Text>Start: {startDate.toLocaleString()}</Text>
                        </View>

                        <View style={styles.dateContainer}>
                            <Button onPress={() => openDatePicker("end")} title="Select End Date & Time" />
                            <Text>End: {endDate.toLocaleString()}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancel"
                            onPress={onClose}
                        />
                        <Button
                            title="Create"
                            onPress={() => {
                                handleSave();
                                onClose();
                            }}
                        />
                    </View>

                    {/* Pickers */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={onDateSelected}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            value={tempDate}
                            mode="time"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={onTimeSelected}
                        />
                    )}
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
        justifyContent: "center",
        padding: 20,
    },
    textContainer: {
        flexDirection: "column",
        gap: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    textbox: {
        padding: 10,
        width: 300,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "lightblue",
        backgroundColor: "white",
    },
    dateContainer: {
        marginTop: 10,
        alignItems: "center",
    },
});

export default CreateUserEvent;
