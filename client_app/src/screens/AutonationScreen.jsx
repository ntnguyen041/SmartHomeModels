import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Button,
  FlatList,
} from "react-native";
import { useState, useEffect, useRef, useMemo } from "react";
import { ref, set, update, onValue, push } from "firebase/database";
import LineChartCustom from "../components/lineChartCustom";
import CircularProgress from "react-native-circular-progress-indicator";
import { COLORS } from "../styles/theme";
import PagerView from "react-native-pager-view";
import { useUser } from "../api/userContext";

export default function AutonationScreen({ navigation }) {
  const { chartDataCount } = useUser();

  return (
    <SafeAreaView style={styles.container}>
      {chartDataCount &&
        chartDataCount.map((chart, index) => {
          return (
            <LineChartCustom
              key={index}
              id={index}
              chartDataCount={chart}
              titleChart={
                index === 0
                  ? "Number of openings of the device"
                  : "The amount of electricity used by the device"
              }
            />
          );
        })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // padding: 20,
  },
  containerButton: {
    marginTop: 50,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
