import React, { useEffect } from "react";
import BottomNavigationBarCustom from "./components/bottomNavigationBar";
import { StyleSheet, View, SafeAreaView, Alert } from "react-native";
import AppBarCustom from "./components/appBarCustom";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faLightbulb,
  faFan,
  faDoorOpen,
  faSnowflake,
  faXmark,
  faPersonShelter,
  faTableList,
  faUserPlus,
  faMoon,
  faSun,
  faHouseUser,
  faCloudSunRain,
  faCloudMoonRain,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "./api/userContext";

library.add(
  faLightbulb,
  faFan,
  faDoorOpen,
  faSnowflake,
  faXmark,
  faPersonShelter,
  faTableList,
  faUserPlus,
  faMoon,
  faSun,
  faHouseUser,
  faCloudSunRain,
  faCloudMoonRain
);

export default function SmartHome() {
  const { getNotificationToken, homeId } = useUser();

  useEffect(() => {
    getNotificationToken();
  }, [homeId]);

  return (
    <View style={styles.container}>
      <AppBarCustom />
      <BottomNavigationBarCustom />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
