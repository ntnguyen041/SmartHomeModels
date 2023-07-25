import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { color } from "../styles";
import BGISmartHome from "../../assets/BgiSmartHome.jpg";
import Logo from "../../assets/LogoInfinity3D.png";
import * as Animatable from "react-native-animatable";
import { COLORS } from "../styles/theme";
import { useUser } from "../api/userContext";

export default function WaitForData({ navigation }) {
  const { rooms } = useUser();

  useEffect(() => {
    // Chuyển hướng đến màn hình main nếu rooms đã được lấy thành công
    if (rooms) {
      navigation.navigate("SmartHome");
    }
  }, [rooms, navigation]);

  return (
    <ImageBackground
      style={styles.container}
      source={BGISmartHome}
      resizeMode="cover"
    >
      <Image style={styles.image} source={Logo} resizeMode="stretch" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 100,
  },
  image: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").width - 40,
  },
});