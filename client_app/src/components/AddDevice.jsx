import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { firebase } from "../../config";
import { ref, set, onValue } from "firebase/database";
import socket from "../api/socket.io";
import { list } from "firebase/storage";
import { useUser } from "../api/userContext";

export default function AddDevice({
  room,
  roomId,
  homeId,
  uid,
  handleCloseModalAdd,
  listDiviceAdd,
}) {
  const [device, setDevice] = useState([
    {
      id: 0,
      nameDevice: "Light",
      iconName: "lightbulb",
      status: false,
    },
    {
      id: 1,
      nameDevice: "Fan",
      iconName: "fan",
      status: false,
    },
    {
      id: 2,
      nameDevice: "Air",
      iconName: "snowflake",
      status: false,
    },
    {
      id: 3,
      nameDevice: "Door",
      iconName: "door-open",
      status: false,
    },
    {
      id: 4,
      nameDevice: "Main Door",
      iconName: "door-open",
      status: false,
    },
    {
      id: 5,
      nameDevice: "Fence Gate",
      iconName: "door-open",
      status: false,
    },
  ]);

  const [homeID, setHomeID] = useState("");

  const { createDevices, dataDevices } = useUser();


  const handleSelectDevice = (id) => {
    const index = device.findIndex((element) => element.id === id);
    if (index >= 0) {
      const newArr = [...device];
      newArr[index].status = !device[index].status;
      setDevice(newArr);
    }
  };

  const handleAddDevice = () => {
    const arr = device.filter((item) => item.status);
    const listCreateDevices = {
      dataDevice: arr,
      roomId,
      roomName: room,
    };

   
    createDevices(listCreateDevices);
  };

  useEffect(() => {
    const differentRooms = device
      .filter((room1) => {
        return !dataDevices.some(
          (room2) => room2.nameDevice === room1.nameDevice
        );
      })
      .concat(
        dataDevices.filter((room2) => {
          return !device.some((room1) => room1.nameDevice === room2.nameDevice);
        })
      );
    setDevice(differentRooms);

  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add device</Text>
        <TouchableOpacity
          onPress={() => {
            handleCloseModalAdd();
          }}
        >
          <FontAwesomeIcon icon="xmark" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        {device &&
          device.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.item,
                  { backgroundColor: item.status ? "orange" : "white" },
                ]}
                onPress={() => handleSelectDevice(item.id)}
              >
                <FontAwesomeIcon icon={item.iconName} size={30} />
                <Text style={styles.titleCard}>{item.nameDevice}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleAddDevice();
          handleCloseModalAdd();
        }}
      >
        <Text style={styles.textButton}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor: 'red',
  },
  body: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  item: {
    width: Dimensions.get("window").width / 2.35,
    height: Dimensions.get("window").width / 6,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
  },
  titleCard: {
    fontSize: 16,
    marginLeft: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    height: "13%",
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
