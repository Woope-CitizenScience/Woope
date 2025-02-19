import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { createReport } from '../api/report';

export const ReportScreen = () => {
    const [formData, setFormData] = useState({
        label: '',
        title: '',
        description: '',
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const labelOptions = [
        { label: 'Home', value: 'Home' },
        { label: 'Resources', value: 'Resources' },
        { label: 'Calendar', value: 'Calendar' },
        { label: 'Map', value: 'Map' },
    ];

    const handleFormSubmit = async () => {
        if (!formData.label || !formData.title || !formData.description) {
            Alert.alert('Error', 'Please fill out all fields before submitting.');
            return;
        }
        try {
            await createReport(formData.label, formData.title, formData.description);
            Alert.alert('Success', 'Report created successfully!');
            setFormData({ label: '', title: '', description: '' });
        } catch (error) {
            console.error('❌ Error creating report:', error);
            Alert.alert('Error', 'Failed to create the report. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a Report</Text>
            <DropDownPicker
                open={dropdownOpen}
                value={formData.label}
                items={labelOptions}
                setOpen={setDropdownOpen}
                setValue={(callback) => setFormData((prev) => ({ ...prev, label: callback(prev.label) }))}
                style={styles.dropdown}
                placeholder="Select a Label"
            />

            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#999"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                placeholderTextColor="#999"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
                <Text style={styles.buttonText}>Submit Report</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    dropdown: {
        marginBottom: 15,
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ReportScreen;