import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {COLORS, SIZES} from "../styles/theme"

export default function CardSetting({ titleCard }) {
  return (
    <View style={styles.cardProfile}>
      <Text style={styles.titleProfile}>{titleCard}</Text>
      <Ionicons name="chevron-forward-outline" size={30} color={COLORS.subTitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardProfile: {
    backgroundColor: COLORS.cardItem,
    padding: SIZES.background,
    height: Dimensions.get("screen").height / 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  },
  titleProfile: {
    fontSize: 15,
    color: COLORS.title,
    fontSize: 20,
  },
});
