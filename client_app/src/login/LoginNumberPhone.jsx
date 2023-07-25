import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  ImageBackground,
  TextInput,
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
import BGISmartHome from "../../assets/BgiSmartHome.jpg";
import { COLORS, SIZES } from "../styles/theme";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import socket from "../api/socket.io";

const app = getApp();
const auth = getAuth(app);

// Double-check that we can run the example
if (!app?.options || Platform.OS === "web") {
  throw new Error(
    "This example only works on Android or iOS, and requires a valid Firebase config."
  );
}
export default LoginNumberPhone = ({ navigation }) => {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState();
  const [verificationCode, setVerificationCode] = useState();
  const [tempNumberPhone, setTempNumberPhone] = useState("");
  const firebaseConfig = app ? app.options : undefined;
  const attemptInvisibleVerification = false;

  function handlePhoneNumberChange(text) {
    let formattedPhoneNumber = text.replace(/^0/, "+84");
    if (!/^(\+84)/.test(formattedPhoneNumber)) {
      formattedPhoneNumber = "+84" + formattedPhoneNumber;
    }
    if (/^\+84\d{0,9}$/.test(formattedPhoneNumber)) {
      setPhoneNumber(formattedPhoneNumber);
      setTempNumberPhone(formattedPhoneNumber);
    } else {
      setPhoneNumber(tempNumberPhone);
    }
  }

  const handleSendOTP = async () => {
    try {
      if (phoneNumber.length !== 12) {
        Alert.alert(
          "Invalid phone number",
          "Please enter a valid phone number",
          {
            text: "OK",
          }
        );
      } else {
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          recaptchaVerifier.current
        );
        // setVerificationId(verificationId);
        navigation.navigate("Verify", {
          verificationId: verificationId,
          phoneNumber: phoneNumber,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = () => {
    socket.emit("loginNumber", phoneNumber);
    socket.on("otpSent", (data) => {
      if (data === "success")
        navigation.navigate("Verify", {
          phoneNumber: phoneNumber,
        });
    });
  };

  useEffect(() => {
    socket.on("login", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <SafeAreaView style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />
      <View
        onStartShouldSetResponder={Keyboard.dismiss}
        style={styles.container}
      >
        <Image
          source={Logo}
          resizeMode="stretch"
          style={styles.image}
          borderRadius={10}
        />
        <View style={{ marginBottom: SIZES.background }}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subTitle}>Please enter your number phone</Text>
          <Text style={styles.subTitle}>to receive a new OTP</Text>
        </View>
        <View style={styles.input}>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            maxLength={12}
            keyboardType="numeric"
            placeholder="number phone "
            placeholderTextColor={COLORS.subTitle}
            onChangeText={handlePhoneNumberChange}
            value={phoneNumber}
            style={styles.textInput}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.textButton}>Continue</Text>
      </TouchableOpacity>
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
    marginBottom: SIZES.background,
  },
  subTitle: {
    textAlign: "center",
    color: COLORS.title,
    fontSize: 16,
  },
  codeFieldRoot: {
    marginTop: SIZES.background,
    padding: 10,
  },
  image: {
    // flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width / 1.3,
    alignContent: "center",
    justifyContent: "center",
  },
  button: {
    margin: Dimensions.get("window").height / 8,
    backgroundColor: COLORS.title,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height / 15,
  },
  textButton: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: Dimensions.get("window").width - 40,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.title,
    borderRadius: 8,
    height: 60,
    justifyContent: "center",
  },
  phoneCountry: {
    fontSize: 20,
    color: COLORS.title,
  },
  textInput: {
    width: "100%",
    color: COLORS.title,
    fontSize: 26,
    textAlign: "center",
  },
});
