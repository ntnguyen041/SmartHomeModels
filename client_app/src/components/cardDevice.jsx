import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { firebase } from "../../config";
import { ref, set, onValue } from "firebase/database";
import socket from "../api/socket.io";
import { useUser } from "../api/userContext";

export default CardDevice = ({
  iconName,
  title,
  subTitle,
  idDevice,
  nameRoom,
  statusOnOff,
  roomId,
  homeId,
  uid,
}) => {
  const { updateDeviceOnOff, dataDevices } = useUser();
  const [statusPin, setStatusPin] = useState(statusOnOff);
  const handleOnOffDevice = () => {
    Vibration.vibrate();
    updateDeviceOnOff(idDevice);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <FontAwesomeIcon icon={iconName} size={50} color="white" />
        <View
          style={[
            styles.circleGreen,
            { backgroundColor: statusOnOff ? "green" : COLORS.cardItem },
          ]}
        ></View>
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>Consumes {subTitle} kWh</Text>
      </View>
      <TouchableOpacity onPress={handleOnOffDevice} style={styles.button}>
        <Ionicons
          name="power-outline"
          size={30}
          color={statusOnOff ? "red" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 2 - 20,
    height: Dimensions.get("window").width / 2 - 20,
    backgroundColor: "#18191a",
    padding: SIZES.background,
    marginBottom: SIZES.background,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  circleGreen: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  title: {
    color: COLORS.title,
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 10,
  },
  subTitle: {
    color: COLORS.subTitle,
    fontSize: 16,
  },
  button: {
    alignItems: "flex-end",
  },
});
