import React, { useState } from "react";
import { View, ScrollView, Switch, Text, StyleSheet } from "react-native";

interface Props {
  onValueChange: () => void;
  value: boolean;
}

const FixedSwitch = ({ onValueChange, value }: Props) => {
  return (
    <View style={styles.switchContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  switchContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 9999, // Ensures switch stays on top of other elements
    backgroundColor: "white", // Optional: adds background for better visibility
    borderRadius: 20, // Optional: matches Switch's border radius
    padding: 5, // Optional: adds some spacing around the switch
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FixedSwitch;
