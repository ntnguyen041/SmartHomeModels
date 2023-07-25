import React, { useContext, useState, useCallback, useEffect } from "react";
import { Text, StyleSheet, Image, TouchableOpacity, View } from "react-native";
import { AppBar, HStack, IconButton } from "@react-native-material/core";
import Avatar from "../../assets/JiDuy.jpg";
import { color } from "../styles";
import { ref, set, onValue } from "firebase/database";
import { COLORS, SIZES } from "../styles/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../api/socket.io";
import userNull from "../../assets/userNull.png";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "../api/userContext";

export default function AppBarCustom() {
  const { selectHome, user, dropDownSelectRoom, prevHomeId, homeId } =
    useUser();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [isInteracted, setIsInteracted] = useState(false);
  
  const handleOnPress = () => {
    setIsInteracted(true);
    prevHomeId(value);
  };

  const handleOnchangeRoom = async (value) => {
    if (isInteracted) {
      selectHome(value);
    }
  };

  useEffect(() => {
    // Đọc đối tượng authToken hiện tại từ bộ nhớ cục bộ
    const roomId = async () => {
      const authTokenString = await AsyncStorage.getItem("authToken");
      const authToken = JSON.parse(authTokenString);

      // Thay đổi trường homeId trong đối tượng authToken
      setValue(authToken.homeId);
    };
    roomId();
  }, [dropDownSelectRoom]);

  return (
    <AppBar
      style={styles.appbarCustom}
      title={`Hi, ${user && user.nameUser ? user.nameUser : ""}`}
      subtitle="Welcome home"
      titleStyle={{ color: COLORS.title }}
      subtitleStyle={{ color: COLORS.subTitle }}
      trailing={(props) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <HStack style={{ width: 140, marginRight: 30 }}>
            <DropDownPicker
              open={open}
              value={value}
              items={dropDownSelectRoom}
              setOpen={setOpen}
              setValue={setValue}
              onChangeValue={handleOnchangeRoom}
              onPress={handleOnPress}
              // setItems={setItems}
              theme="DARK"
              mode="BADGE"
            />
          </HStack>
          <HStack>
            {user && user.imageUser ? (
              <Image source={{ uri: user.imageUser }} style={styles.image} />
            ) : (
              <Image source={userNull} style={styles.image} />
            )}
          </HStack>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  textCustom: {
    fontSize: 18,
  },
  appbarCustom: {
    backgroundColor: COLORS.background,
    justifyContent: "flex-end",
    height: "12%",
    paddingRight: SIZES.background,
    paddingBottom: 10,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 5,
  },
});
