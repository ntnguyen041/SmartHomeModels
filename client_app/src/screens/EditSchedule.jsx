import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import DayTimeBottomSheet from "../components/DayTimeBottomSheet";
import { compareAsc, format } from "date-fns";
import { COLORS, SIZES } from "../styles/theme";
import socket from "../api/socket.io";
import { useUser } from "../api/userContext";

export default function EditSchedule({ navigation, route }) {
  const [dateOn, setDateOn] = useState(new Date());
  const [dateOff, setDateOff] = useState(new Date());
  const [day, setDay] = useState([]);
  const [onOff, setOnOff] = useState(null);
  const bottomSheetModalRed = useRef(null);
  const snapPoints = ["48%"];

  const { dropDownSelectDevice, dropDownSelectDevices, createScheduleDevice } =
    useUser();

  const handlePresentModal = () => {
    bottomSheetModalRed.current?.present();
  };
  const handleCloseModal = () => {
    bottomSheetModalRed.current?.close();
  };

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (route.params.title === "Add") {
      dropDownSelectDevice();
    }
  }, []);

  const handleUpdateTime = () => {
    const deviceId =
      route.params.title === "Add" ? title : route.params.idDevice;

    const createSchedule = {
      dayRunning: day,
      timeOn: format(dateOn, "h:mm a"),
      timeOff: format(dateOff, "h:mm a"),
      deviceId,
    };

    createScheduleDevice(createSchedule);
  };
  const StrTimer = (date) => {
    let str = "";
    let convertHours = "";
    let AmPm = "";

    if (date.getHours() > 12) {
      convertHours = date.getHours() - 12;
      AmPm = "PM";
    } else {
      convertHours = date.getHours();
      AmPm = "AM";
    }
    str = `${day.join(", ")} - ${convertHours} : ${date.getMinutes()} ${AmPm}`;
    return str;
  };

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1, padding: SIZES.background }}>
          <View style={styles.editProfileTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back-outline"
                size={30}
                color={COLORS.icon}
              />
            </TouchableOpacity>
            <Text style={styles.title} onPress={handleCloseModal}>
              {route.params.title} Schedule
            </Text>
          </View>

          <View style={styles.editProfileBottom}>
            <Text style={styles.titleInput}>Device Name</Text>
            {route.params.title === "Add" ? (
              <DropDownPicker
                style={{ height: 60, marginBottom: SIZES.background }}
                textStyle={{
                  fontSize: 18,
                }}
                open={open}
                value={title}
                items={dropDownSelectDevices}
                setOpen={setOpen}
                setValue={setTitle}
                setItems={setItems}
                theme="DARK"
                multiple={true}
                mode="BADGE"
                badgeDotColors={[
                  "#e76f51",
                  "#00b4d8",
                  "#e9c46a",
                  "#e76f51",
                  "#8ac926",
                  "#00b4d8",
                  "#e9c46a",
                ]}
                searchable={true}
                searchablePlaceholder="Search for an item"
                multipleText="%d items have been selected."
                // autoScroll={true}
                maxHeight={300}
                stickyHeader={true}
              />
            ) : (
              <View style={styles.input}>
                <Text style={{ color: "white", fontSize: 18 }}>
                  {route.params.deviceName}
                </Text>
              </View>
            )}

            <Text style={styles.titleInput}>When to ON</Text>
            <View style={styles.input}>
              <Text
                style={styles.textInput}
                onPress={() => {
                  handlePresentModal();
                  setOnOff("ON");
                }}
              >
                {day.length ? StrTimer(dateOn) : "Select time"}
              </Text>
            </View>
            <Text style={styles.titleInput}>When to OFF</Text>
            <View style={styles.input}>
              <Text
                style={styles.textInput}
                onPress={() => {
                  handlePresentModal();
                  setOnOff("OFF");
                }}
              >
                {day.length ? StrTimer(dateOff) : "Select time"}
              </Text>
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              disabled={day.length ? false : true}
              style={[styles.buttonCenter, , { opacity: day.length ? 1 : 0.5 }]}
              onPress={() => {
                handleUpdateTime();
                navigation.goBack();
              }}
            >
              <Text style={styles.titleButton}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRed}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={styles.bottomSheet}
        >
          <DayTimeBottomSheet
            dateOn={dateOn}
            setDateOn={setDateOn}
            dateOff={dateOff}
            setDateOff={setDateOff}
            day={day}
            setDay={setDay}
            onOff={onOff}
            handleCloseModal={handleCloseModal}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.background,
  },
  editProfileTop: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  editProfileCenter: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  editProfileBottom: {
    flex: 9,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: "bold",
    color: COLORS.title,
    marginLeft: 10,
  },
  image: {
    width: Dimensions.get("screen").width / 3,
    height: Dimensions.get("screen").width / 3,
    borderRadius: Dimensions.get("screen").width / 2,
  },
  circle: {
    padding: 5,
    backgroundColor: "orange",
    borderRadius: "100%",
    position: "absolute",
    bottom: "5%",
    right: "35%",
  },
  titleInput: {
    color: COLORS.title,
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderRadius: 8,
    backgroundColor: COLORS.cardItem,
    padding: SIZES.background,
    marginBottom: SIZES.background,
  },
  textInput: {
    // height: 60,
    // margin: 12,
    color: COLORS.title,
    fontSize: 18,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  buttonCenter: {
    width: "100%",
    borderRadius: 8,
    height: 60,
    backgroundColor: COLORS.title,
    justifyContent: "center",
    alignItems: "center",
  },
  titleButton: {
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.background,
  },
  bottomSheet: {
    backgroundColor: COLORS.cardItem,
  },
});
