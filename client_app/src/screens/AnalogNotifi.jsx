import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default AnalogNotifi = (navigation) => {
  return (
    <View style={styles.analogDeleteRoom}>
      <View style={styles.analog}>
        <Text style={styles.titleAnalog}>Do you want to delete the room?</Text>
        <View style={styles.analogBottom}>
          <TouchableOpacity style={styles.analogButton}>
            <Text style={{ color: "white", fontSize: 20 }}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.analogButton}>
            <Text style={{ color: "white", fontSize: 20 }}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  analogDeleteRoom: {
    position: "absolute",
    backgroundColor: "#00000099",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  analog: {
    width: "90%",
    height: "30%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  analogBottom: {
    flexDirection: "row",
    gap: 20,
  },
  analogButton: {
    width: 100,
    height: 50,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  titleAnalog: {
    fontSize: 20,
  },
});
