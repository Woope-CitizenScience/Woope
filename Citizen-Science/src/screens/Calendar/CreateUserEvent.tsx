import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet, SafeAreaView, Text } from "react-native";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import { createUserEvents } from "../../api/event";

interface EventInfo {
  name: string;
  tagline: string;
  description: string;
}

interface ModalProps {
  user_id: number;
  isVisible: boolean;
  onClose: () => void;
}

const CreateUserEvent: React.FC<ModalProps> = ({ user_id, isVisible, onClose }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<false | "start" | "end">(false);
  const [newInfo, setNewInfo] = useState({
    name: "",
    tagline: "",
    description: "",
  });

  const handleSave = async () => {
    try {
      await createUserEvents(user_id, newInfo.name, newInfo.tagline, newInfo.description, startDate, endDate);
      onClose();
    } catch (error) {
      console.log("Update Failed", error);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
   
    if (event.type === "set" && selectedDate instanceof Date ) {
      //user picks date
      if (showPicker === "start") {
        setStartDate(selectedDate);
      } else if (showPicker === "end") {
        setEndDate(selectedDate);
      }
       
    }

    console.log("Shut off")
    setShowPicker(false);
  };

  const handleInputChange = (field: keyof EventInfo, value: string): void => {
    setNewInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onClose}>
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
              multiline
              scrollEnabled
              style={styles.textbox}
            />

            <View style={styles.dateContainer}>
              <Button title="Enter Start Date" onPress={() => setShowPicker("start")} />
              <Text>{startDate.toLocaleString()}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Button title="Enter End Time" onPress={() => setShowPicker("end")} />
              <Text>{endDate.toLocaleString()}</Text>
            </View>
          </View>

          {showPicker && (
            <View>
              <DateTimePicker 
                value={showPicker === "start" ? startDate : endDate}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            </View>
            
          )}

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Create" onPress={handleSave} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeview: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreateUserEvent;
