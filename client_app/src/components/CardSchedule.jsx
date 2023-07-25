import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import socket from "../api/socket.io";
import { useUser } from "../api/userContext";

export default function CardSchedule({
  navigation,
  titleDevice,
  timeOn,
  timeOff,
  iconName,
  day,
  roomName,
  dayRunningStatus,
  idDevice,
  uid,
  homeId,
}) {
  const [isEnabled, setIsEnabled] = useState(dayRunningStatus);
  const { updateScheduleDevice } = useUser();

  useEffect(() => {
    setIsEnabled(dayRunningStatus);
  }, [dayRunningStatus]);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);

    const dataSchedule = {
      deviceId: idDevice,
      status: !dayRunningStatus,
    };
    updateScheduleDevice(dataSchedule);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.titleCard}>
          {titleDevice} - {roomName}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditSchedule", {
              title: "Edit",
              homeId,
              uid,
              timeOn,
              timeOff,
              day,
              deviceName: `${titleDevice} - ${roomName}`,
              idDevice,
            })
          }
        >
          <Ionicons name="create-outline" color={COLORS.icon} size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
      <View style={styles.cardBody}>
        <Text style={styles.titleRepeat}>Repeat day: {day.toString()}</Text>
        <View style={styles.bodyRepeat}>
          <View style={styles.repeat}>
            <Text style={styles.titleOnOff}>ON</Text>
            <Text style={styles.timeOnOff}>{timeOn}</Text>
          </View>
          <View style={styles.repeat}>
            <Text style={styles.titleOnOff}>OFF</Text>
            <Text style={styles.timeOnOff}>{timeOff}</Text>
          </View>
          <View style={styles.switch}>
            <Switch
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <Ionicons name={iconName} size={60} color={COLORS.icon} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: Dimensions.get("screen").height / 4.7,
    backgroundColor: COLORS.cardItem,
    borderRadius: SIZES.border,
    marginBottom: SIZES.background,
    padding: SIZES.background,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  line: {
    width: "100%",
    height: 1,
    marginVertical: 10,
    backgroundColor: COLORS.subTitle,
  },
  titleCard: {
    color: COLORS.title,
    fontSize: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  titleRepeat: {
    color: COLORS.subTitle,
    fontSize: SIZES.subTitleCard,
  },
  bodyRepeat: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleOnOff: {
    fontSize: 20,
    color: COLORS.subTitle,
    marginTop: 15,
    marginBottom: 15,
  },
  timeOnOff: {
    fontSize: SIZES.titleCard,
    color: COLORS.title,
  },
  repeat: {
    flex: 1,
  },
  switch: {
    justifyContent: "flex-end",
  },
});
