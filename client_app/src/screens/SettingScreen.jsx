import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import Avatar from "../../assets/JiDuy.jpg";
import CardSetting from "../components/CardSetting";
import { storage, firebase } from "../../config";
// import { ref, set, onValue } from "firebase/database";
import { COLORS, SIZES } from "../styles/theme";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../api/socket.io";
import userNull from "../../assets/userNull.png";
import { useUser } from "../api/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Ionicons } from "@expo/vector-icons";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import DropDownPicker from "react-native-dropdown-picker";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

export default function SettingScreen({ navigation }) {
  const bottomSheetModalRed = useRef(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const {
    user,
    addHomeToUser,
    listUserToRoomId,
    createHome,
    myHomeList,
    home,
  } = useUser();
  const [numberPhone, setNumberPhone] = useState("");
  const [tempNumberPhone, setTempNumberPhone] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [dropDownMyHome, setDropDownMyHome] = useState();
  const [isInteracted, setIsInteracted] = useState(false);
  const [addUserHomeId, setAddUserHomeId] = useState();

  const handleOnPress = () => {
    setIsInteracted(true);
  };

  const handleOpenBottomSheep = () => {
    setVisible(false);
    bottomSheetModalRed.current?.present();
  };
  const handleCloseBottomSheet = () => {
    bottomSheetModalRed.current?.close();
    setNumberPhone("");
    Keyboard.dismiss();
    setVisible(false);
  };

  const handleLogout = async () => {
    // Xóa mã thông báo khỏi AsyncStorage
    await AsyncStorage.removeItem("authToken");

    // Chuyển hướng người dùng đến màn hình đăng nhập hoặc đăng ký
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginNumberPhone" }],
    });
  };

  const handleAdd = () => {
    const addUserToHome = {
      numberPhone: numberPhone,
      homeId: addUserHomeId,
    };
    addHomeToUser(addUserToHome);
    Keyboard.dismiss();
    setNumberPhone("");
  };

  function handlePhoneNumberChange(text) {
    let formattedPhoneNumber = text.replace(/^0/, "+84");
    if (!/^(\+84)/.test(formattedPhoneNumber)) {
      formattedPhoneNumber = "+84" + formattedPhoneNumber;
    }
    if (/^\+84\d{0,9}$/.test(formattedPhoneNumber)) {
      setNumberPhone(formattedPhoneNumber);
      setTempNumberPhone(formattedPhoneNumber);
    } else {
      setNumberPhone(tempNumberPhone);
    }
  }

  const [visible, setVisible] = useState(false);

  const listUserToRoom = () => {
    setVisible(false);
    navigation.navigate("ListUserToHome");
    listUserToRoomId();
  };
  const handleMyHomeList = () => {
    setVisible(false);
    navigation.navigate("MyHomeList");
    myHomeList();
  };

  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const handleCreateHome = () => {
    Alert.alert("Create Home", "Do you want to create a new home?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          createHome();
          setVisible(false);
        },
      },
    ]);
  };

  useEffect(() => {
    const homes = home.map((home) => ({
      label: home.nameHome,
      value: home._id,
    }));
    setDropDownMyHome(homes);
  }, [home]);

  const handleOnchangeRoom = async (value) => {
    if (isInteracted) {
      setAddUserHomeId(value);
    }
  };

  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        <View style={styles.topProfile}>
          {user.imageUser ? (
            <Image source={{ uri: user.imageUser }} style={styles.image} />
          ) : (
            <Image source={userNull} style={styles.image} />
          )}
          <View style={{ justifyContent: "flex-end", marginLeft: 20, flex: 1 }}>
            <Text style={styles.title}>{user.nameUser}</Text>
            <Text style={styles.subTitle}>{user.phoneUser}</Text>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <Menu
              style={{ paddingHorizontal: 10 }}
              visible={visible}
              anchor={
                <TouchableOpacity
                  style={{ justifyContent: "flex-end" }}
                  onPress={showMenu}
                >
                  <FontAwesomeIcon
                    icon="person-shelter"
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              }
              onRequestClose={hideMenu}
            >
              <MenuItem onPress={listUserToRoom}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon icon="table-list" size={25} color="black" />
                  <Text style={{ fontSize: 16, marginLeft: 15 }}>
                    List of users controlling your home
                  </Text>
                </View>
              </MenuItem>
              <MenuItem onPress={handleMyHomeList}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon icon="table-list" size={25} color="black" />
                  <Text style={{ fontSize: 16, marginLeft: 15 }}>
                    My Home List
                  </Text>
                </View>
              </MenuItem>
              <MenuDivider />
              <MenuItem onPress={handleOpenBottomSheep}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon icon="user-plus" size={25} color="black" />
                  <Text style={{ fontSize: 16, marginLeft: 15 }}>
                    Add user to home
                  </Text>
                </View>
              </MenuItem>
              <MenuItem onPress={handleCreateHome}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon icon="house-user" size={25} color="black" />
                  <Text style={{ fontSize: 16, marginLeft: 15 }}>
                    Create Home
                  </Text>
                </View>
              </MenuItem>
            </Menu>
          </View>
        </View>
        <View style={styles.bottomProfile}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile", { user })}
          >
            <CardSetting titleCard="Account Setting" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <CardSetting titleCard="Notifications" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ContactUs")}>
            <CardSetting titleCard="Contact us" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("TermsConditions")}
          >
            <CardSetting titleCard="Terms & conditions" />
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.buttonCenter} onPress={handleLogout}>
            <Text style={styles.titleButton}>Logout</Text>
          </TouchableOpacity>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRed}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={styles.bottomSheet}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={styles.headerBottomSheet}>
              <Text style={styles.headerTitle}> Add user to home</Text>
              <TouchableOpacity onPress={handleCloseBottomSheet}>
                <Ionicons name="close-outline" color={COLORS.icon} size={30} />
              </TouchableOpacity>
            </View>
            <View style={styles.bodyBottomSheet}>
              <DropDownPicker
                open={open}
                value={value}
                items={dropDownMyHome}
                setOpen={setOpen}
                setValue={setValue}
                onChangeValue={handleOnchangeRoom}
                onPress={handleOnPress}
                theme="DARK"
                mode="BADGE"
              />
              <BottomSheetTextInput
                // placeholder="Enter your room name"
                keyboardType="numeric"
                placeholder="number phone "
                placeholderTextColor={COLORS.subTitle}
                onChangeText={handlePhoneNumberChange}
                value={numberPhone}
                style={styles.textInput}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  { opacity: numberPhone.length === 12 && value ? 1 : 0.5 },
                ]}
                onPress={() => {
                  handleAdd();
                  handleCloseBottomSheet();
                }}
                disabled={numberPhone.length === 12 && value ? false : true}
              >
                <Text style={styles.titleButton}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.background,
    backgroundColor: COLORS.background,
  },
  topProfile: {
    flex: 2,
    // alignItems: "center",
    flexDirection: "row",
  },
  bottomProfile: {
    flex: 6,
    marginTop: 40,
    gap: SIZES.background,
  },
  image: {
    width: Dimensions.get("screen").width / 3,
    height: Dimensions.get("screen").width / 3,
    borderRadius: 10,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: "bold",
    marginTop: 10,
    color: COLORS.title,
  },
  subTitle: {
    fontSize: 15,
    color: COLORS.subTitle,
  },
  bottomSheet: {
    backgroundColor: "#18191a",
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
  headerBottomSheet: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.title,
    fontSize: 24,
    fontWeight: "bold",
  },
  bodyBottomSheet: {
    flex: 1,
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
    marginTop: 20,
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
