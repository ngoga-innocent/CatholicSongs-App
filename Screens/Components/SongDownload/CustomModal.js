import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../Global";

const CustomModal = ({ visible, onClose, title, options }) => {
    
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              className="border border-slate-700 rounded-full bg-transparent"
              onPress={() => {
                option.onPress();
                onClose(); // Close the modal after selecting an option
              }}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(106, 106, 112, 0.32)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#000",
    borderRadius: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "transparent",
    borderRadius: 5,
    alignItems: "center",
  },
  optionText: {
    color: "gray",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default CustomModal;
