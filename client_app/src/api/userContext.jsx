import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "./socket.io";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [uid, setUid] = useState();
  const [user, setUser] = useState();
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [devicesRunning, setDevicesRunning] = useState([]);
  const [authToken, setAuthToken] = useState(null); // Thêm biến state authToken
  const [tokenCheck, setTokenCheck] = useState(false);
  const [dataDevices, setDataDevices] = useState([]);
  const [homeId, setHomeId] = useState();
  const [scheduleOnOff, setScheduleOnOff] = useState([]);
  const [dropDownSelectDevices, setdropDownSelectDevices] = useState([]);
  const [dropDownSelectRoom, setDropDownSelectRoom] = useState([]);
  const [isSelectHome, setIsSelectHome] = useState(false);
  const [prevHome, setPrevHome] = useState();
  const [socketId, setSocketId] = useState();
  const [listUserToRoom, setListUserToRoom] = useState([]);
  const [notification, setNotification] = useState([]);
  const [chartDataCount, setChartDataCount] = useState([]);
  const [home, setHome] = useState([]);
  const [weather, setWeather] = useState();

  useEffect(() => {
    AsyncStorage.getItem("authToken")
      .then(async (authTokenJson) => {
        if (authTokenJson) {
          const authToken = JSON.parse(authTokenJson);
          setAuthToken(authToken); // Lưu giá trị authToken vào biến state
          setHomeId(authToken.homeId);
          setUid(authToken.uid);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [tokenCheck, isSelectHome]);

  useEffect(() => {
    if (authToken && uid && homeId) {
      socket.emit("getUser", {
        uid: authToken.uid,
        homeId: homeId,
      });
    }
  }, [authToken, uid]);

  useEffect(() => {
    if (authToken && homeId && uid) {
      socket.emit("getListDeviceTime", { uid, homeId });
    }
  }, [authToken, homeId, uid]);

  useEffect(() => {
    if (authToken && homeId) {
      // console.log(authToken);
      // Kiểm tra xem authToken và authToken.homeId có tồn tại hay không
      socket.emit("joinRoom", homeId);
      socket.emit("getData", authToken.uid);
      socket.emit("getRoomList", {
        uid: authToken.uid,
        homeId: homeId,
      });
      socket.emit("getDeviceRunning", {
        uid: authToken.uid,
        homeId: homeId,
      });
    }
  }, [authToken, homeId]);

  useEffect(() => {
    if (authToken && homeId && uid) {
      socket.on("socketId", (id) => {
        setSocketId(id);
      });
      // Kiểm tra xem authToken và authToken.homeId có tồn tại hay không
      socket.on(`getUser${uid}`, (dataUser) => {
        setUser(dataUser);
      });

      socket.on("getDeviceRunning", (data) => {
        setDevicesRunning(data);
      });
      socket.on(`listDevice${uid}`, async (listDevices) => {
        setDataDevices(listDevices);
      });

      socket.on("createDevice", async (listDevices) => {
        setDataDevices((prevDataDevices) => [
          ...prevDataDevices,
          ...listDevices,
        ]);
      });

      socket.on("createDeviceQR", (dataDevice) => {
        setDataDevices((prevDataDevices) => [...prevDataDevices, dataDevice]);
      });

      socket.on(`qrScanFailed${uid}`, (data) => {
        Alert.alert("Scan failed", data, [
          {
            text: "OK",
          },
        ]);
      });

      socket.on("createRoom", (data) => {
        setRooms((prevRooms) => [...prevRooms, data]);
      });
      socket.on("deleteRoom", (deletedRoomId) => {
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room._id !== deletedRoomId)
        );
      });
      socket.on("deleteDevice", (deletedDeviceId) => {
        setDataDevices((prevDevices) =>
          prevDevices.filter((device) => device._id !== deletedDeviceId)
        );
      });
      socket.on("deviceUpdated", (updatedDevice) => {
        setDataDevices((prevDevices) => {
          const newDevices = prevDevices.map((device) => {
            if (device._id === updatedDevice.idDevice) {
              return {
                ...device,
                status: updatedDevice.status,
              };
            } else {
              return device;
            }
          });
          return newDevices;
        });
      });
      socket.on("deviceRunningUpdated", (updatedDevice) => {
        setDevicesRunning((prevDevices) => {
          const newDevices = prevDevices.map((device) => {
            if (device._id === updatedDevice.idDevice) {
              return {
                ...device,
                status: updatedDevice.status,
              };
            } else {
              return device;
            }
          });
          return newDevices;
        });
      });

      socket.on("optionsList", (options) => {
        setdropDownSelectDevices(options);
      });

      socket.on(`dropDownRoom${uid}`, (data) => {
        setDropDownSelectRoom(data);
      });

      socket.on(`addDropDownHome${uid}`, (data) => {
        setDropDownSelectRoom((prev) => [...prev, data]);
      });

      socket.on(`updateDropDownHome${uid}`, (data) => {
        Alert.alert(
          "Home Status Changed",
          `Your membership to the home ${data.home.nameHome} has been revoked`,
          {
            text: "OK",
          }
        );

        if (homeId === data.home._id)
          AsyncStorage.getItem("authToken")
            .then(async (authTokenJson) => {
              if (authTokenJson) {
                const authToken = JSON.parse(authTokenJson);

                authToken.homeId = await data.arrDropDown[0].value;

                console.log(data.arrDropDown[0].value);
                setDropDownSelectRoom(data.arrDropDown);
                return AsyncStorage.setItem(
                  "authToken",
                  JSON.stringify(authToken)
                );
              }
            })

            // setHomeId(data[0].value);

            .catch((error) => {
              console.error(error);
            });
        else setDropDownSelectRoom(data.arrDropDown);
      });

      socket.on(`deleteHome${uid}`, async (data) => {
        Alert.alert(
          "Home Status Changed",
          `The home ${data.home.nameHome} has been deleted.`,
          {
            text: "OK",
          }
        );
        if (homeId === data.home._id)
          AsyncStorage.getItem("authToken").then((authTokenJson) => {
            if (authTokenJson) {
              const authToken = JSON.parse(authTokenJson);

              authToken.homeId = user.homeId[0];
              setAuthToken(authToken);
              // setHomeId(user.homeId[0]);

              return AsyncStorage.setItem(
                "authToken",
                JSON.stringify(authToken)
              );
            }
          });
        else setDropDownSelectRoom(data.dropDown);
      });

      socket.on(`listUserToRoomId${uid}`, (data) => {
        setListUserToRoom(data);
      });

      socket.on("getListSchedule", (data) => {
        setScheduleOnOff(data);
      });

      socket.on("getListNotification", (notificationData) => {
        setNotification(notificationData.reverse());
      });

      socket.on("reportData", (chartData) => {
        setChartDataCount(chartData);
      });

      socket.on(`myHomeList${uid}`, (home) => {
        setHome(home);
      });

      socket.on("weather", (data) => {
        setWeather(data);
      });

      return () => {
        socket.off(`getUser${uid}`);
        socket.off("devicesRunning");
        socket.off(`listDevice${uid}`);
        socket.off("createRoom");
        socket.off("deleteRoom");
        socket.off("deleteDevice");
        socket.off("deviceUpdated");
        socket.off("optionsList");
        socket.off(`dropDownRoom${uid}`);
        socket.off(`addDropDownHome${uid}`);
        socket.off(`updateDropDownHome${uid}`);
        socket.off("getListSchedule");
        socket.off("weather");
        socket.off(`deleteHome${uid}`);
      };
    }
  }, [authToken, homeId, uid]);

  useEffect(() => {
    if (authToken && homeId) {
      socket.on("listRoom", (listRoom) => {
        setRooms(listRoom);
      });
      return () => {
        socket.off("listRoom");
      };
    }
  }, [authToken, homeId]);

  useEffect(() => {
    if (authToken && homeId && uid) {
      const homeData = {
        homeId: homeId,
        uid: uid,
      };
      socket.emit("dropDownHome", homeData);
      return () => {
        socket.off("dropDownHome");
      };
    }
  }, [authToken, homeId, uid]);

  useEffect(() => {
    if (authToken && homeId && uid) {
      socket.emit("reportData", { homeId: homeId });
    }
  }, [authToken, homeId, uid]);

  useEffect(() => {
    if (authToken && homeId && uid) {
      socket.emit("myHomeList", { uid: uid });
    }
  }, [authToken, homeId, uid]);

  const createHome = async () => {
    socket.emit("createHome", { uid: uid });
  };

  const createRooms = async (newRooms) => {
    const { nameRoom, imageRoom } = newRooms;
    if (authToken && homeId) {
      // Kiểm tra xem authToken và authToken.homeId có tồn tại hay không
      await socket.emit("createRoom", {
        nameRoom,
        imageRoom,
        uid: authToken.uid,
        homeId: homeId,
      });
    }
  };

  const updateRoom = async (dataRoom) => {
    dataRoom.homeId = homeId;
    socket.emit("updateRoom", dataRoom);
    console.log(dataRoom);
  };

  const deleteRooms = async (roomId) => {
    if (authToken && homeId) {
      // Kiểm tra xem authToken và authToken.homeId có tồn tại hay không
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));

      await socket.emit("deleteRoom", {
        roomId: roomId,
        homeId: homeId,
        uid: authToken.uid,
      });
    }
  };
  const checkToken = async (token) => {
    setTokenCheck(token);
  };

  const createDevices = async (dataDevices) => {
    const { dataDevice, roomId, roomName } = dataDevices;
    const listCreateDevices = {
      dataDevice: dataDevice,
      roomId,
      roomName,
      homeId: homeId,
      uid: authToken.uid,
    };
    socket.emit("createDevice", listCreateDevices);
  };

  const listDevicesOfRoom = async (idRoom) => {
    const dataDevices = {
      roomId: idRoom,
      homeId: homeId,
      uid: uid,
    };
    socket.emit("getDevice", dataDevices);
  };

  const deleteDevice = async (dataDevice) => {
    if (authToken && homeId) {
      const { id, roomId } = dataDevice;
      const deviceDelete = {
        deviceId: id,
        roomId,
        homeId: homeId,
        uid: authToken.uid,
      };
      setDataDevices((prevDevices) =>
        prevDevices.filter((device) => device._id !== id)
      );
      await socket.emit("deleteDevice", deviceDelete);
    }
  };

  const resetDataDevice = () => {
    setDataDevices([]);
  };

  const updateDeviceOnOff = async (dataDevice) => {
    const deviceIndex = dataDevices.findIndex(
      (device) => device._id === dataDevice
    );
    if (deviceIndex >= 0) {
      const deviceToUpdate = dataDevices[deviceIndex];
      const updatedDevice = {
        ...deviceToUpdate,
        status: !deviceToUpdate.status,
      };
      setDataDevices((prevDevices) => {
        const newDevices = [...prevDevices];
        newDevices[deviceIndex] = updatedDevice;
        return newDevices;
      });
      // Do something with the updated device...
      const diviceData = {
        idDevice: updatedDevice._id,
        status: updatedDevice.status,
        homeId: homeId,
        pinEsp: updatedDevice.pinEsp,
        uid: authToken.uid,
      };
      socket.emit("updateOnOff", diviceData);
    }
    const deviceRunningIndex = devicesRunning.findIndex(
      (device) => device._id === dataDevice
    );
    if (deviceRunningIndex >= 0) {
      const deviceToUpdate = devicesRunning[deviceRunningIndex];
      const updatedDevice = {
        ...deviceToUpdate,
        status: !deviceToUpdate.status,
      };
      setDevicesRunning((prevDevices) => {
        const newDevices = [...prevDevices];
        newDevices[deviceRunningIndex] = updatedDevice;
        return newDevices;
      });
      // Do something with the updated device...
      const diviceData = {
        idDevice: updatedDevice._id,
        status: updatedDevice.status,
        homeId: homeId,
        uid: authToken.uid,
        pinEsp: updatedDevice.pinEsp,
      };
      socket.emit("updateOnOff", diviceData);
    }
  };

  const prevHomeId = (value) => {
    setPrevHome(value);
  };

  const selectHome = async (homeIds) => {
    try {
      // Đọc đối tượng authToken hiện tại từ bộ nhớ cục bộ
      const authTokenString = await AsyncStorage.getItem("authToken");
      const authToken = JSON.parse(authTokenString);

      // Thay đổi trường homeId trong đối tượng authToken
      authToken.homeId = homeIds;

      // Lưu đối tượng authToken mới vào bộ nhớ cục bộ
      await AsyncStorage.setItem("authToken", JSON.stringify(authToken));

      socket.emit("joinRoomSelect", {
        homeId: homeIds,
        socketId: socketId,
        roomIdPrev: prevHome,
      });

      setHomeId(homeIds);
    } catch (error) {
      console.error(error);
    }
  };

  const QRCodeScanner = (dataCreateDevice) => {
    dataCreateDevice.uid = uid;
    socket.emit("createDeviceQrCode", dataCreateDevice);
  };

  const dropDownSelectDevice = () => {
    socket.emit("listDeviceDropDown", homeId);
  };

  const createScheduleDevice = (dataSchedule) => {
    dataSchedule.homeId = homeId;
    socket.emit("updateDeviceOnOff", dataSchedule);
  };

  const deteleScheduleDevice = (dataSchedule) => {
    const filteredScheduleOnOff = scheduleOnOff.filter(
      (item) => item._id !== dataSchedule.idDevice
    );
    setScheduleOnOff(filteredScheduleOnOff);

    dataSchedule.homeId = homeId;

    socket.emit("deleteScheduleOnOff", dataSchedule);
  };

  const updateScheduleDevice = (dataSchedule) => {
    dataSchedule.homeId = homeId;
    socket.emit("updateScheduleOnOff", dataSchedule);
  };

  const addHomeToUser = (data) => {
    const { numberPhone, homeId } = data;
    const listAddHomeToUser = {
      numberPhone: numberPhone,
      homeId: homeId,
    };
    socket.emit("addHoomToUser", listAddHomeToUser);
  };

  const updateUser = (dataUser) => {
    dataUser.uid = uid;
    socket.emit("updateUser", dataUser);
    socket.on(`updateUser${uid}`, (data) => {
      setUser(data);
    });
    socket.on(`updateHome${uid}`, (dataHome) => {
      setDropDownSelectRoom((prevHome) =>
        prevHome.map((item) => {
          if (item.value === dataHome._id) {
            return { ...item, label: dataHome.nameHome };
          }
          return item;
        })
      );
    });
  };

  const listUserToRoomId = () => {
    socket.emit("listUserToRoomId", { uid: uid });
  };

  const deleteUserToRoomId = (data) => {
    const { homeId, userId } = data;
    const updatedList = listUserToRoom.map((home) => {
      if (home.id === homeId) {
        // Filter out the user with the matching _id
        const updatedUsers = home.user.filter((user) => user._id !== userId);
        return {
          ...home,
          user: updatedUsers,
        };
      } else {
        return home;
      }
    });
    setListUserToRoom(updatedList);
    socket.emit("deleteUserToRoomId", { id: userId, homeId: homeId });
  };
  const getListNotification = () => {
    socket.emit("getListNotification", homeId);
  };

  const deleteNotification = (dataNotification) => {
    const notificationList = notification.filter(
      (item) => item._id !== dataNotification.notificationId
    );
    setNotification(notificationList);

    dataNotification.homeId = homeId;
    socket.emit("deleteNotification", dataNotification);
  };

  const myHomeList = () => {
    socket.emit("myHomeList", { uid: uid });
  };

  const deleteHome = (data) => {
    const homeList = home.filter((item) => item._id !== data.id);
    setHome(homeList);
    data.uid = uid;
    socket.emit("deleteHome", data);
  };

  const updateHomeName = (data) => {
    data.uid = uid;
    socket.emit("updateHomeName", data);
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const getNotificationToken = async () => {
    if (homeId) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Security",
            "For security and protection of your home, since you did not grant notification permission previously, please go to Settings then go to Notifications to enable Smart Home app notifications to receive updates on your home's status.",
            {
              text: "OK",
            }
          );
          return;
        }
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();

      const token = await tokenData.data;

      await socket.emit("sendToken", { token: token, homeId: homeId });

      return token;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        rooms,
        homeId,
        home,
        devices,
        devicesRunning,
        dataDevices,
        scheduleOnOff,
        dropDownSelectDevices,
        dropDownSelectRoom,
        listUserToRoom,
        notification,
        chartDataCount,
        weather,
        createRoom: createRooms,
        createHome: createHome,
        deleteHome: deleteHome,
        deleteRooms: deleteRooms,
        updateRoom: updateRoom,
        tokenCheck: checkToken,
        createDevices: createDevices,
        listDevicesOfRoom: listDevicesOfRoom,
        deleteDevice: deleteDevice,
        resetDataDevice: resetDataDevice,
        updateDeviceOnOff: updateDeviceOnOff,
        selectHome: selectHome,
        QRCodeScanner: QRCodeScanner,
        dropDownSelectDevice: dropDownSelectDevice,
        createScheduleDevice: createScheduleDevice,
        deteleScheduleDevice: deteleScheduleDevice,
        updateScheduleDevice: updateScheduleDevice,
        addHomeToUser: addHomeToUser,
        prevHomeId: prevHomeId,
        updateUser: updateUser,
        listUserToRoomId: listUserToRoomId,
        deleteUserToRoomId: deleteUserToRoomId,
        getListNotification: getListNotification,
        deleteNotification: deleteNotification,
        myHomeList: myHomeList,
        updateHomeName: updateHomeName,
        getNotificationToken: getNotificationToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
