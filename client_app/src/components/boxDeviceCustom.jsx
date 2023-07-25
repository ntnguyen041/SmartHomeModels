import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useUser } from "../api/userContext";

export default BoxDeviceCustom = ({
  title,
  subTitle,
  iconName,
  nameRoom,
  idDevice,
  statusOnOff,
  homeId,
  roomId,
  uid,
  pinEsp
}) => {
  const { updateDeviceOnOff } = useUser();
  const handleOnOffDevice = () => {
    Vibration.vibrate();
    
    updateDeviceOnOff(idDevice);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <FontAwesomeIcon icon={iconName} size={50} color={COLORS.icon} />
        <View style={styles.circle}></View>
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{nameRoom}</Text>
        <Text style={styles.subTitle}>Consumers {subTitle} kWh</Text>
      </View>
      <TouchableOpacity onPress={handleOnOffDevice} style={styles.input}>
        <Ionicons name="power-outline" size={30} color={COLORS.iconPower} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    backgroundColor: "#18191a",
    padding: SIZES.background,
    marginRight: SIZES.background,
    borderRadius: SIZES.border,
    justifyContent: "space-between",
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 100,
  },
  title: {
    color: COLORS.title,
    fontSize: SIZES.titleCard,
    fontWeight: "bold",
  },
  subTitle: {
    color: COLORS.subTitle,
    fontSize: SIZES.subTitleCard,
  },
  input: {
    alignItems: "flex-end",
  },
});
