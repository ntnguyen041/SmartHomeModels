import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import socket from "../api/socket.io";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useUser } from "../api/userContext";

export default BoxWeather = () => {
  const { weather } = useUser();
  const [hour, setHour] = useState();


  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    hour >= 6 && hour < 18 ? setHour(true) : setHour(false);
  }, [hour]);

  return (
    
    <View
      style={[
        styles.weather,
        {
          backgroundColor: COLORS.cardItem,
          display: weather ? "flex" : "none",
        },
      ]}
    >
      <View style={styles.boxWeather}>
        <Text style={styles.titleWeatherDay}>
          {Date().toString().substring(0, 15)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
     
          <FontAwesomeIcon
            icon={
              hour && weather && weather.weather
                ? "sun"
                : hour && weather && !weather.weather
                ? "cloud-sun-rain"
                : !hour && weather && weather.weather
                ? "moon"
                : "cloud-moon-rain"
            }
            size={60}
            color="white"
            style={{ marginRight: 10 }}
          />
          <View>
            <Text
              style={{ color: COLORS.title, fontSize: 22, fontWeight: "bold" }}
            >
              {hour && weather && weather.weather
                ? "Sun Day"
                : hour && weather && !weather.weather
                ? "Sun Rain"
                : !hour && weather && weather.weather
                ? "Moon Day"
                : "Moon Rain"}
            </Text>
            <Text
              style={{ color: COLORS.title, fontSize: 30, fontWeight: "bold" }}
            >
              25°C 
            </Text>
          </View>
        </View>
      </View>
      <View style={[{ paddingLeft: 50 }, styles.boxWeather]}>
        <View>
          <Text style={styles.title}>
            {weather ? weather.temperature : 0}°C
          </Text>
          <Text style={styles.subTitle}>Temperature</Text>
        </View>
        <View>
          <Text style={styles.title}>{weather ? weather.humidity : 0}%</Text>
          <Text style={styles.subTitle}>Humidity</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weather: {
    height: Dimensions.get("window").height / 6,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    marginTop: SIZES.background,
    paddingHorizontal: 10,
  },
  boxWeather: {
    flex: 1,
    padding: 10,
    justifyContent: "space-evenly",
  },
  titleWeatherDay: {
    color: COLORS.subTitle,
  },
  title: {
    color: COLORS.title,
    fontSize: Dimensions.get("window").width / 20,
  },
  subTitle: {
    color: COLORS.subTitle,
    fontSize: Dimensions.get("window").width / 28,
  },
});
