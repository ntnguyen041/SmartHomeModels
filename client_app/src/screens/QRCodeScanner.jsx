import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useUser } from "../api/userContext";
import ImageQrCode from "../../assets/boxQrCode.png";

export default function QRCodeScanner({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { QRCodeScanner, homeId } = useUser();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    try {
      const objDevice = JSON.parse(data);

      if (homeId === objDevice.homeId) {
        objDevice.roomId = route.params.roomId;
        objDevice.roomName = route.params.roomName;

        QRCodeScanner(objDevice);
        navigation.goBack();
      } else {
        Alert.alert("Scan failed", "This device is not owned by your home", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Scan failed", "Invalid QR code", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrDataContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.title}>Back to Room</Text>
      </View>
      <View style={styles.titleQR}>
        <Text style={styles.titleQRHeader}>Scan QR Code</Text>
        <Text style={styles.subTitleQRHeader}>
          Please position the QR code at the center of the camera's viewfinder
          to initiate the scanning process, which will assist you in setting up
          your home device.
        </Text>
      </View>
      <View style={styles.body}>
        <Image source={ImageQrCode} style={styles.image} resizeMode="contain" />
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeSize
          style={styles.QRCode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.9)",
    backgroundColor: "#000000",
  },
  QRCode: {
    position: "absolute",
    width: Dimensions.get("screen").width / 1.5,
    height: Dimensions.get("screen").width / 1.5,
  },
  image: {
    position: "absolute",
    width: Dimensions.get("screen").width / 1.35,
    height: Dimensions.get("screen").width / 1.35,
    // backgroundColor: "white",
    // resizeMode: 'cover'
  },
  titleQR: {
    alignItems: "center",
    marginTop: 30,
  },
  titleQRHeader: {
    color: "white",
    fontSize: 30,
    marginBottom: 20,
  },
  subTitleQRHeader: {
    color: "grey",
    fontSize: 16,
    textAlign: "justify",
    width: Dimensions.get("screen").width / 1.1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  qrDataContainer: {
    // position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    // paddingVertical: 20,
    flexDirection: "row",
    height: "10%",
    alignItems: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginLeft: 10,
  },
});
