import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DayTimeBottomSheet({
  dateOn,
  setDateOn,
  day,
  setDay,
  dateOff,
  setDateOff,
  onOff,
  handleCloseModal
}) {
  const [selectDay, setSelectDay] = useState([
    {
      id: 1,
      day: "Mon",
      status: false,
    },
    {
      id: 2,
      day: "Tue",
      status: false,
    },
    {
      id: 3,
      day: "Wed",
      status: false,
    },
    {
      id: 4,
      day: "Thu",
      status: false,
    },
    {
      id: 5,
      day: "Fri",
      status: false,
    },
    {
      id: 6,
      day: "Sat",
      status: false,
    },
    {
      id: 7,
      day: "Sun",
      status: false,
    },
  ]);

  const updateFieldChanged = (index, status) => {
    let newArr = [...selectDay];
    newArr[index].status = status;
    setSelectDay(newArr);
  };

  const updateStatusDay = (index) => {
    let status = selectDay[index].status;
    status = !status;
    updateFieldChanged(index, status);
  };

  const onChangeTime = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      onOff === "ON" ? setDateOn(currentDate) : setDateOff(currentDate);
    }
  };


  const select = () => {
    let str = [];
    selectDay.map((item) => {
      if (item.status) str.push(item.day);
    });
    setDay(str);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.bottomSheetDay}>
          <Text style={styles.title}>Select Days</Text>
          <TouchableOpacity onPress={handleCloseModal}>
            <Ionicons name="close-outline" size={30} color={COLORS.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.selectButton}>
          {selectDay.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  {
                    updateStatusDay(index);
                    select();
                  }
                }}
                style={[
                  item.id == 1
                    ? styles.buttonDayStart
                    : item.id == 7
                    ? styles.buttonDayEnd
                    : styles.buttonDay,
                  { backgroundColor: item.status ? "orange" : "transparent" },
                ]}
              >
                <Text style={styles.titleDay}>{item.day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.title}>Select Time</Text>
        <DateTimePicker
          textColor={COLORS.title}
          mode="time"
          display="spinner"
          value={onOff == "ON" ? dateOn : dateOff}
          onChange={onChangeTime}
          is24Hour={false}
          locale="en-US"
          style={styles.dateTimePicker}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SIZES.background,
    marginBottom: SIZES.background,
  },
  bottomSheetDay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: COLORS.title,
    fontSize: 20,
    fontWeight: "bold",
  },
  selectButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    marginVertical: SIZES.background,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDayStart: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDayEnd: {
    flex: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  titleDay: {
    color: COLORS.title,
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  dateTimePicker: {
    marginVertical: SIZES.background,
  },
});
