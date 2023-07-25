import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Avatar from "../../assets/JiDuy.jpg";
import * as ImagePicker from "expo-image-picker";
import { ref, set, onValue } from "firebase/database";
import { COLORS, SIZES } from "../styles/theme";
import { firebase } from "../../config";
import "firebase/compat/storage";
import socket from "../api/socket.io";
import { useUser } from "../api/userContext";
import userNull from "../../assets/userNull.png";

export default function EditProfile({ navigation, route }) {
  const { user, dropDownSelectRoom, updateUser } = useUser();

  const [imageUser, setImageUser] = useState(user.imageUser || "");
  const [nameUser, setNameUser] = useState(user.nameUser || "");
  const [mailUser, setMailUser] = useState(user.mailUser || "");
  const [phoneUser, setPhoneUser] = useState(user.phoneUser || "");
  const [nameHome, setNameHome] = useState(dropDownSelectRoom[0].label || "");

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Get reference to Firebase storage
      var uriImage = result.assets[0].uri.split("/");
      const storageRef = firebase
        .storage()
        .ref("images/" + uriImage[uriImage.length - 1]);

      // Upload image to storage
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      await storageRef.put(blob);

      // Get download URL for uploaded image
      const downloadURL = await storageRef.getDownloadURL();

      // Set state to display uploadedimage
      setImageUser(downloadURL);
      console.log(downloadURL)
    }
  };

  const handleUpdateUser = async () => {
    updateUser({
      _id: user._id,
      imageUser,
      nameUser,
      mailUser,
      nameHome,
      homeId: dropDownSelectRoom[0].value,
    });
    navigation.goBack()
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: SIZES.background }}>
        <View style={styles.editProfileTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color={COLORS.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        <View style={styles.editProfileCenter}>
          {imageUser.length !== 0 ? (
            <Image source={{ uri: imageUser }} style={styles.image} />
          ) : (
            <Image source={userNull} style={styles.image} />
          )}
          <View style={styles.circle}>
            <TouchableOpacity onPress={handleUpload}>
              <Ionicons name="image" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAwareScrollView
        >
          <View style={styles.editProfileBottom}>
            <Text style={styles.titleInput}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setNameUser}
              defaultValue={nameUser}
            />
            <Text style={styles.titleInput}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setMailUser}
              defaultValue={mailUser}
            />
            <Text style={styles.titleInput}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setPhoneUser}
              defaultValue={phoneUser}
              editable={false}
            />
            <Text style={styles.titleInput}>Home Name</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setNameHome}
              defaultValue={nameHome}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.buttonCenter}
            onPress={handleUpdateUser}
          >
            <Text style={styles.titleButton}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.background,
  },
  editProfileTop: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  editProfileCenter: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  editProfileBottom: {
    flex: 9,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: "bold",
    color: COLORS.title,
    marginLeft: 10,
  },
  image: {
    width: Dimensions.get("screen").width / 3,
    height: Dimensions.get("screen").width / 3,
    borderRadius: 10,
  },
  circle: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    right: "28%",
  },
  titleInput: {
    color: COLORS.title,
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    height: 60,
    // margin: 12,
    borderWidth: 2,
    padding: 10,
    borderColor: COLORS.subTitle,
    color: COLORS.title,
    fontSize: 18,
    borderRadius: 8,
    marginBottom: SIZES.background,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  buttonCenter: {
    width: "100%",
    borderRadius: 8,
    height: 60,
    backgroundColor: COLORS.title,
    justifyContent: "center",
    alignItems: "center",
  },
  titleButton: {
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.background,
  },
});
