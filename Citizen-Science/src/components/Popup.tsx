import React from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import { PopupProps } from '../types';
import CustomButton from '../components/CustomButton';

const Popup: React.FC<PopupProps> = ({ isVisible, message, onClose }) => {
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{message}</Text>
                    <CustomButton
                        label="OK"
                        onPress={onClose}
                        size={{ width: 100, height: 40 }} // Adjust the size as needed
                        labelColor="white"
                        backgroundColor="#2196F3"
                        borderRadius={10}
                        position={{ top: 0, left: 0 }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default Popup;