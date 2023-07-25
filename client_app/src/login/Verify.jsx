import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  ImageBackground,
  Keyboard,
  Alert,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Logo from "../../assets/Logo3D.png";
import Background from "../../assets/BGSmartHome.jpg";
import { COLORS, SIZES } from "../styles/theme";
import { db, firebase } from "../../config";
import { set, ref } from "firebase/database";
import socket from "../api/socket.io";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../api/userContext";

const CELL_COUNT = 6;

export default LoginNumberPhone = ({ navigation, route }) => {
  const { tokenCheck } = useUser();
  // const [OTP, setOTP] = useState("");
  const [value, setValue] = useState("");
  // const [verificationId, setVerificationId] = useState();
  const [verificationCode, setVerificationCode] = useState();
  const refFill = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  function makeId(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }


  // Hàm xử lý khi người dùng xác minh mã OTP
  const handleVerifyOTP = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        route.params.verificationId,
        value
      );
      // Đăng nhập người dùng bằng credential
      const response = await firebase.auth().signInWithCredential(credential);
      // Kiểm tra xem người dùng mới hay cũ
      if (response.additionalUserInfo.isNewUser) {
        // Nếu người dùng mới, tạo tài khoản và lưu thông tin đăng nhập vào AsyncStorage
        await socket.emit("joinRoom", response.user.uid);
        const result = await socket.emit("createUser", {
          uid: response.user.uid,
          nameUser: makeId(10),
          phoneUser: route.params.phoneNumber,
          imageUser: "",
          nameHome: makeId(10),
        });
        if (result) {
          socket.on("homeCreated", async (homeId) => {
            await AsyncStorage.setItem(
              "authToken",
              JSON.stringify({ uid: response.user.uid, homeId: homeId })
            );
            tokenCheck(true);
            navigation.reset({
              index: 0,
              routes: [{ name: "SmartHome" }],
            });
          });
        }
      } else {
        // Nếu người dùng cũ, đăng nhập và lưu thông tin đăng nhập vào AsyncStorage
        await socket.emit("joinRoom", response.user.uid);
        socket.emit("getUserLogin", { uid: response.user.uid });
        socket.on(`getUserLogin${response.user.uid}`, async (homeId) => {
          await AsyncStorage.setItem(
            "authToken",
            JSON.stringify({ uid: response.user.uid, homeId: homeId })
          ).then(() => {
            tokenCheck(true);
            navigation.reset({
              index: 0,
              routes: [{ name: "SmartHome" }],
            });
          });
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Invalid OTP",
        "The OTP you entered is incorrect. Please try again.",
        {
          text: "OK",
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View onStartShouldSetResponder={Keyboard.dismiss}>
        <Image
          source={Logo}
          resizeMode="stretch"
          style={styles.image}
          borderRadius={10}
        />
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subTitle}>
          We have sent OTP to your number phone, please type code in here
        </Text>
        <CodeField
          ref={refFill}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          // caretHidden ={true}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>

      <TouchableOpacity
        // disabled={!verificationId}
        style={styles.button}
        onPress={handleVerifyOTP}
      >
        <Text style={styles.textButton}>Continue</Text>
      </TouchableOpacity>
      <View style={styles.containerGoBack}>
        <Text style={styles.subTitle}>On change number phone </Text>
        <Text style={styles.subTitle} onPress={() => navigation.goBack()}>
          Go Back
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 35,
    color: COLORS.title,
    fontWeight: "bold",
  },
  subTitle: {
    textAlign: "center",
    color: COLORS.title,
    fontSize: 16,
    marginTop: SIZES.background,
  },
  codeFieldRoot: {
    marginTop: SIZES.background,
    padding: 10,
  },
  cell: {
    width: 60,
    height: 60,
    padding: 10,
    margin: 2,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: COLORS.title,
    textAlign: "center",
    borderRadius: 8,
    color: COLORS.title,
  },
  focusCell: {
    borderColor: "orange",
  },
  image: {
    // flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width / 1.3,
    alignContent: "center",
    justifyContent: "center",
  },
  button: {
    margin: Dimensions.get("window").height / 10,
    backgroundColor: COLORS.title,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height / 15,
  },
  textButton: {
    fontSize: 24,
    fontWeight: "bold",
  },
  containerGoBack: {
    flexDirection: "row",
  },
});
