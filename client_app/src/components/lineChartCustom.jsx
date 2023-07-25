import React, { useState, useEffect } from "react";
import { Dimensions, Text, StyleSheet, View } from "react-native";
import { LineChart, ProgressChart } from "react-native-chart-kit";
export default function LineChartCustom({ titleChart, chartDataCount, id }) {
  return (
    <View style={{ marginTop: 20 }}>
      <LineChart
        data={{
          labels: chartDataCount.labels,
          datasets: [
            {
              data: chartDataCount.data,
            },
          ],
        }}
        width={Dimensions.get("window").width  * 0.9} 
        height={220}
        yAxisInterval={1} 
        yAxisSuffix={id !== 0 ? " kW" : ""}
        chartConfig={{
          backgroundColor: "white",
          decimalPlaces: id !== 0 ? 2 : 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
        }}
      />
      <Text style={styles.titleChart}>{titleChart}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleChart: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});
