import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ColorPicker from "react-native-wheel-color-picker";

export default LightBottomSheet = () => {
  const [currentColor, setCurrentColor] = useState("#fff");
  const [isDevice, setIsDevice] = useState(false);
  const onColorChange = (selectedColor) => {
    setCurrentColor(selectedColor);
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Smart Light</Text>
        <TouchableOpacity onPress={() => setIsDevice(!isDevice)}>
          <Ionicons name="power-outline" size={30} color={isDevice ? "red" : "grey"} />
        </TouchableOpacity>
      </View>
      <View style={styles.smartContainer}>
        <ColorPicker
          style={styles.colorPicker}
          gapSize={30}
          color={currentColor}
          swatchesOnly={false}
          onPress={currentColor}
          shadeSliderThumb={true}
          onColorChange={onColorChange}
          thumbSize={30}
          sliderSize={40}
          noSnap={true}
          row={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItem: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  smartContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  colorPicker:{
    width: '80%',
    marginBottom: 50,
  }

});
