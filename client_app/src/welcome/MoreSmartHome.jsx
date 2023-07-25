import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import Logo from "../../assets/MoreOne.jpg";
import CircularProgress from "react-native-circular-progress-indicator";
import {COLORS, SIZES} from "../styles/theme"


export default MoreSmartHome = ({ navigation }) => {
  const [nextMore, setNextMore] = useState(1);
  const title = ["","Manage Home", "Control Devices", "Get Notified"];
  const subTitle = ["","The system allows to control all the devices of the smart home and can more than help us to automate all the devices.", "Smart home can control the device with the phone at will, or the sensor automates everything.", "Notify about the amount of water as well as the amount of electricity, forgetting to turn off, helping you manage your home better."];

  const nextScreen = () => {
    let next = nextMore;
    nextMore < 3
      ? setNextMore(++next)
      : navigation.navigate("LoginNumberPhone");
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image style={styles.image} source={Logo} resizeMode="stretch" />
      </View>
      {/* <TouchableOpacity style={[styles.buttonBack, styles.button]} onPress={() => nextScreen()}>
        <Text style={styles.titleNext}>Next</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={[styles.button, styles.buttonNext,]} onPress={() => nextScreen()}>
        <Text style={styles.titleNext}>Next</Text>
      </TouchableOpacity>
      <View style={styles.bottom}>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>{title[nextMore]}</Text>
          <Text style={styles.subTitle}>
            {subTitle[nextMore]}
          </Text>
        </View>
        <CircularProgress
          value={nextMore}
          radius={40}
          duration={300}
          progressValueColor={COLORS.title}
          maxValue={3}
          activeStrokeColor={COLORS.title}
          inActiveStrokeColor={COLORS.title}
          inActiveStrokeOpacity={0.2}
          titleColor={COLORS.title}
          titleStyle={{ fontWeight: "bold" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 3,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 2,
    backgroundColor: COLORS.cardItem,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  containerTitle:{
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 3.2,
    height: Dimensions.get("window").width / 7,
    backgroundColor: COLORS.title,
    borderRadius: 8,
    top: Dimensions.get("window").height / 1.76,
    
    zIndex: 1,
  },
  buttonBack:{
    width: Dimensions.get("window").width / 3.2,
    height: Dimensions.get("window").width / 7,
    top: Dimensions.get("window").height / 1.76,
    left: SIZES.background,
  },
  buttonNext:{
    width: Dimensions.get("window").width / 3.2,
    height: Dimensions.get("window").width / 7,
    top: Dimensions.get("window").height / 1.76,
    right: SIZES.background,
  },
  titleNext: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.background,
  },
  image: {
    width: '100%',
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: SIZES.background,
    color: COLORS.title
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 30,
    color: COLORS.title
  },
});
