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

export default function Welcome({ navigation }) {

  return (
    //onStartShouldSetResponder={() => navigation.navigate("Room")}
    <ImageBackground
      style={styles.container}
      source={BGISmartHome}
      resizeMode="cover"
    >
      <Image style={styles.image} source={Logo} resizeMode="stretch" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MoreSmartHome")}
      >
        <Text style={styles.title}>Get Started</Text>
      </TouchableOpacity>
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

  button: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").width / 7,
    backgroundColor: COLORS.title,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
