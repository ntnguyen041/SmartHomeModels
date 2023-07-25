import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SmartHome from "../SmartHome";
import Verify from "../login/Verify";
import LoginNumberPhone from "../login/LoginNumberPhone";
import Welcome from "../welcome/Welcome";
import MoreSmartHome from "../welcome/MoreSmartHome";
import RoomDeviceScreen from "../screens/RoomDeviceScreen";
import EditProfile from "../screens/EditProfile";
import EditSchedule from "../screens/EditSchedule";
import ContactUs from "../screens/ContactUs";
import TermsConditions from "../screens/TermsConditions";
import Notifications from "../screens/Notification";
import firebase from "firebase/compat/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCodeScanner from "../screens/QRCodeScanner";
import ListUserToHome from "../screens/ListUserToHome";
import WaitForData from "../screens/WaitForData";
import MyHomeList from "../screens/MyHomeList";

const Stack = createNativeStackNavigator();

export default function Route() {
  const [initialRoute, setInitialRoute] = useState("");
  const [isInitialRouteSet, setIsInitialRouteSet] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  //     user ? setInitialRoute("SmartHome") : setInitialRoute("Welcome");

  //     setIsInitialRouteSet(true);
  //   });
  //   return unsubscribe;
  // }, []);
  useEffect(() => {
    AsyncStorage.getItem("authToken").then((token) => {
      token ? setInitialRoute("SmartHome") : setInitialRoute("Welcome");
      setIsInitialRouteSet(true);
    });
  }, []);

  return (
    <>
      {isInitialRouteSet && (
        <NavigationContainer>
          <Stack.Navigator
          // initialRouteName="WaitForData"
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="MoreSmartHome" component={MoreSmartHome} />
            <Stack.Screen
              name="LoginNumberPhone"
              component={LoginNumberPhone}
            />
            <Stack.Screen name="Verify" component={Verify} />
            <Stack.Screen name="SmartHome" component={SmartHome} />
            <Stack.Screen name="WaitForData" component={WaitForData} />
            <Stack.Screen
              name="RoomDeviceScreen"
              component={RoomDeviceScreen}
            />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="EditSchedule" component={EditSchedule} />
            <Stack.Screen name="ContactUs" component={ContactUs} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
            <Stack.Screen name="ListUserToHome" component={ListUserToHome} />
            <Stack.Screen name="MyHomeList" component={MyHomeList} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
