import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import CardSchedule from "../components/CardSchedule";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import socket from "../api/socket.io";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DraxProvider, DraxView } from "react-native-drax";
import { useUser } from "../api/userContext";

export default function ScheduleScreen({ navigation, route }) {
  const [data, setData] = useState([]);
  const [uid, setUid] = useState();
  const [homeId, setHomeId] = useState();
  const [isShowDelete, setIsShowDelete] = useState(false);

  const {scheduleOnOff, deteleScheduleDevice} = useUser()

  const handleDeleteDevice = (idDevice) => {
    deteleScheduleDevice({idDevice})
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("EditSchedule", { title: "Add", uid, homeId });
          }}
        >
          <Ionicons name="add-outline" size={40} color={COLORS.icon} />
        </TouchableOpacity>
      </View>
      <DraxProvider>
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {scheduleOnOff &&
            scheduleOnOff.map((item) => {
              return (
                <DraxView
                  key={item._id}
                  draggingStyle={styles.dragging}
                  dragReleasedStyle={styles.dragging}
                  dragPayload={item._id}
                  longPressDelay={100}
                  onDragStart={() => {
                    setIsShowDelete(true);
                  }}
                  onDragEnd={() => {
                    setIsShowDelete(false);
                  }}
                >
                  <CardSchedule
                    key={item._id}
                    titleDevice={item.nameDevice}
                    roomName={item.roomName}
                    timeOn={item.timeOn}
                    timeOff={item.timeOff}
                    iconName={item.iconName}
                    day={item.dayRunning}
                    navigation={navigation}
                    dayRunningStatus={item.dayRunningStatus}
                    idDevice={item._id}
                    uid={uid}
                    homeId={homeId}
                  />
                </DraxView>
              );
            })}
        </ScrollView>
        <DraxView
          style={[
            styles.zoneDeleteDevice,
            { display: isShowDelete ? "flex" : "none" },
          ]}
          onReceiveDragDrop={(event) => {
            handleDeleteDevice(event.dragged.payload || "?");
            setIsShowDelete(false);
          }}
        >
          <Ionicons name="trash-bin-outline" color="white" size={50} />
        </DraxView>
      </DraxProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.background,
  },
  header: {
    paddingBottom: SIZES.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    flex: 1,
  },
  title: {
    color: COLORS.title,
    fontSize: SIZES.title,
    fontWeight: "bold",
  },
  zoneDeleteDevice: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    borderStyle: "dashed",
    position: "absolute",
    bottom: 50,
    justifyContent: "center", 
    alignItems: "center", 
  },
  dragging: {
    opacity: 0.2,
  },
});
