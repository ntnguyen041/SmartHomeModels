import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import { get, onValue, ref } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import socket from "../api/socket.io";
import { useUser } from "../api/userContext";

export default function BoxRoom({
  room,
  device,
  imageUrl,
  navigation,
  roomId,
  uid,
  homeId,
  setIdRoomDelete,
  setOptionRoom,
  handleOpenBottomSheep,
  setRoomName,
}) {
  var title = room;

  const { deleteRooms } = useUser();

  const handleSetshowDialogDeleteRoom = () => {
    Alert.alert("Delete Room", `You want to delete the ${room}`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteRooms(roomId);
        },
      },
    ]);
  };
  return (
    //onStartShouldSetResponder={() => navigation.navigate("Room")}

    <ImageBackground
      source={{ uri: imageUrl }}
      resizeMode="cover"
      style={styles.image}
      borderRadius={SIZES.border}
    >
      <View style={styles.option}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            setIdRoomDelete(roomId);
            setOptionRoom("Edit");
            handleOpenBottomSheep();
          }}
        >
          <Ionicons name="create-outline" color="white" size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            handleSetshowDialogDeleteRoom();
          }}
        >
          <Ionicons name="close" color="white" size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottom}>
        <View>
          <Text style={styles.textRoom}>{room}</Text>
          <Text style={styles.textDevice}>{device.length} Device</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("RoomDeviceScreen", {
              title: title,
              roomId: roomId,
              homeId: homeId,
              uid: uid,
            })
          }
        >
          <Ionicons
            name="chevron-forward-outline"
            size={30}
            color={COLORS.icon}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    marginBottom: SIZES.background,
    // width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.26,
    backgroundColor: COLORS.cardItem,
    borderRadius: SIZES.border,
  },
  image: {
    flex: 1,
    marginBottom: SIZES.background,
    // width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.26,
    backgroundColor: COLORS.cardItem,
    borderRadius: SIZES.border,
    justifyContent: "space-between",
    resizeMode: "cover",
  },
  textRoom: {
    color: COLORS.title,
    fontSize: SIZES.titleCard,
    fontWeight: "bold",
  },
  textDevice: {
    color: COLORS.subTitle,
    fontSize: SIZES.subTitleCard,
    // fontWeight: "bold",
  },
  header: {
    alignItems: "flex-end",
    margin: 10,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#00000099",
  },
  option: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
