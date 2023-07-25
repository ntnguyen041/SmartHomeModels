import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { COLORS, SIZES } from "../styles/theme";
// import * as firebase from "firebase";
import "firebase/compat/storage";
import { firebase } from "../../config";
import { ref, set, onValue } from "firebase/database";

import socket from "../api/socket.io";
import { useUser } from "../api/userContext";

export default function AddRoomBottomSheet({
  handleCloseBottomSheet,
  uid,
  homeId,
  optionRoom,
  idRoom,
}) {
  const [image, setImage] = useState(null);
  const [nameRoom, setNameRoom] = useState("");
  const [homeID, setHomeID] = useState("");

  const { createRoom, rooms, updateRoom } = useUser();

  useEffect(() => {
    if (optionRoom === "Edit") {
      const room = rooms.filter((item) => item._id === idRoom);
      setNameRoom(room[0].nameRoom);
      setImage(room[0].imageRoom);
    }
  }, [idRoom]);

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSetRoom = async () => {
    const uriImage = image.split("/");
    const nameImage = uriImage[uriImage.length - 1].split(".")[1];
    const storageRef = firebase
      .storage()
      .ref("images/room" + uriImage[uriImage.length - 1]);
      // .ref(`images/room/${nameRoom.replace(/\s/g, "")}.${nameImage}`);
    // Upload image to storage
    const response = await fetch(image);
    const blob = await response.blob();
    await storageRef.put(blob);

    // Get download URL for uploaded image
    const downloadURL = await storageRef.getDownloadURL();
    if (optionRoom === "Add") {
      createRoom({
        nameRoom: nameRoom,
        imageRoom: downloadURL,
      });
    } else {
      updateRoom({
        nameRoom: nameRoom,
        imageRoom: downloadURL,
        idRoom: idRoom,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBottomSheet}>
        <Text style={styles.headerTitle}>{optionRoom} Room</Text>
        <TouchableOpacity onPress={handleCloseBottomSheet}>
          <Ionicons name="close-outline" color={COLORS.icon} size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyBottomSheet}>
        <TouchableOpacity onPress={handleUpload} style={styles.boxSelectImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" color={COLORS.icon} size={40} />
          )}
        </TouchableOpacity>
        <BottomSheetTextInput
          // placeholder="Enter your room name"
          placeholderTextColor={COLORS.subTitle}
          onChangeText={setNameRoom}
          value={nameRoom}
          style={styles.textInput}
        />
        <TouchableOpacity
          style={[styles.button, { opacity: nameRoom && image ? 1 : 0.5 }]}
          onPress={() => {
            handleSetRoom();
            handleCloseBottomSheet();
          }}
          disabled={nameRoom && image ? false : true}
        >
          <Text style={styles.titleButton}>{optionRoom}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.background,
    paddingBottom: SIZES.background,
  },
  headerBottomSheet: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.title,
    fontSize: 24,
    fontWeight: "bold",
  },
  bodyBottomSheet: {
    flex: 1,
  },
  boxSelectImage: {
    width: "100%",
    height: 150,
    marginVertical: 50,
    borderWidth: 1,
    borderColor: COLORS.title,
    borderRadius: 10,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.title,
    borderRadius: 8,
    color: COLORS.title,
    fontSize: 20,
    padding: SIZES.background,
    marginBottom: SIZES.background,
  },
  button: {
    height: 60,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  titleButton: {
    fontSize: 26,
    fontWeight: "bold",
  },
});
