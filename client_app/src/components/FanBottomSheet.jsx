import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";

export default FanBottomSheet = () => {
  const [number, setNumber] = useState(0);

  return (
    <View>
      <Text>{number}</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="orange"
        maximumTrackTintColor="grey"
        value={number}
        onValueChange={setNumber}
        step={1}
        tapToSeek={true}
      />
    </View>
  );
};
