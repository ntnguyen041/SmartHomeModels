import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Vibration,
} from "react-native";
import BoxRoom from "../components/boxRoom";
import Ionicons from "react-native-vector-icons/Ionicons";
import BoxWeather from "../components/boxWeather";
import BoxDeviceCustom from "../components/boxDeviceCustom";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import AddRoomBottomSheet from "../components/AddRoomBottomSheet";
import { COLORS, SIZES } from "../styles/theme";
import { onValue, ref, child, off } from "firebase/database";
import socket from "../api/socket.io";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../api/userContext";

export default function HomeScreen({ navigation }) {
  const [roomsData, setRoomsData] = useState([]);
  const [deviceRunning, setDeviceRunning] = useState([]);
  const bottomSheetModalRed = useRef(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const [uid, setUid] = useState("");
  const [idRoomDelete, setIdRoomDelete] = useState();
  const [roomName, setRoomName] = useState();
  const [optionRoom, setOptionRoom] = useState("");

  const { devicesRunning, rooms, deleteRooms, getListDevicesRunning, homeId } =
    useUser();

  const handleOpenBottomSheep = () => {
    bottomSheetModalRed.current?.present();
  };
  const handleCloseBottomSheet = () => {
    bottomSheetModalRed.current?.close();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModalProvider>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <BoxWeather />
          {devicesRunning.length != 0 && (
            <Text style={styles.title}>Running Appliance</Text>
          )}

          <ScrollView
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {devicesRunning &&
              devicesRunning.map((item) => {
                return (
                  <BoxDeviceCustom
                    key={item._id}
                    iconName={item.iconName}
                    title={item.nameDevice}
                    subTitle={item.consumes}
                    nameRoom={item.roomName}
                    homeId={item.homeId}
                    roomId={item.roomId}
                    idDevice={item._id}
                    statusOnOff={item.status}
                    uid={uid}
                    pinEsp={item.pinEsp}
                  />
                );
              })}
          </ScrollView>
          <View style={styles.headerRoom}>
            <Text style={styles.title}>Rooms</Text>
            <TouchableOpacity
              onPress={() => {
                setOptionRoom("Add");
                handleOpenBottomSheep();
              }}
            >
              <Ionicons name="add-outline" color={COLORS.icon} size={30} />
            </TouchableOpacity>
          </View>
          {rooms &&
            rooms.map((item) => {
              return (
                <BoxRoom
                  key={item._id}
                  homeId={homeId}
                  roomId={item._id}
                  uid={uid}
                  room={item.nameRoom}
                  device={item.devicesId}
                  imageUrl={item.imageRoom}
                  navigation={navigation}
                  setIdRoomDelete={setIdRoomDelete}
                  setRoomName={setRoomName}
                  setOptionRoom={setOptionRoom}
                  handleOpenBottomSheep={handleOpenBottomSheep}
                />
              );
            })}
        </ScrollView>
        <BottomSheetModal
          ref={bottomSheetModalRed}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={styles.bottomSheet}
        >
          <AddRoomBottomSheet
            handleCloseBottomSheet={handleCloseBottomSheet}
            uid={uid}
            homeId={homeId}
            optionRoom={optionRoom}
            idRoom={idRoomDelete}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: "relative",
  },
  scrollView: {
    marginHorizontal: SIZES.background,
  },
  title: {
    color: COLORS.title,
    fontSize: SIZES.title,
    fontWeight: "bold",
    paddingBottom: SIZES.background,
    paddingTop: SIZES.background,
  },
  headerRoom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomSheet: {
    backgroundColor: COLORS.cardItem,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  analogDeleteRoom: {
    position: "absolute",
    backgroundColor: "#00000099",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
