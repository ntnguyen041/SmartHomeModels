import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BoxDeviceCustom from "../components/boxDeviceCustom";
import CardDevice from "../components/cardDevice";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import ColorPicker from "react-native-wheel-color-picker";
import LightBottomSheet from "../components/LightBottomSheet";
import FanBottomSheet from "../components/FanBottomSheet";
import { COLORS, SIZES } from "../styles/theme";
import AddDevice from "../components/AddDevice";
import { DraxProvider, DraxView } from "react-native-drax";
import socket from "../api/socket.io";
import { useUser } from "../api/userContext";

export default RoomDeviceScreen = ({ navigation, route }) => {
  const [dataDevice, setDataDevice] = useState([]);
  const [strDevice, setStrDevice] = useState("");
  const bottomSheetModalRed = useRef(null);
  const bottomSheetModalRedAdd = useRef(null);
  const snapPoints = ["70%"];
  const snapPointsAdd = ["60%"];
  const [isShowDelete, setIsShowDelete] = useState(false);

  const handlePresentModal = () => {
    bottomSheetModalRed.current?.present();
  };
  const handleCloseModalAdd = () => {
    bottomSheetModalRedAdd.current?.close();
  };
  const handlePresentModalAdd = () => {
    bottomSheetModalRedAdd.current?.present();
  };

  const { listDevicesOfRoom, dataDevices, deleteDevice, resetDataDevice } =
    useUser();

  useEffect(() => {
    listDevicesOfRoom(route.params.roomId);
  }, []);

  const handleDeleteDevice = (deviceData) => {
    deleteDevice(deviceData);
  };


  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={styles.containerTitle}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
                resetDataDevice();
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={30}
                color={COLORS.icon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{route.params.title}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("QRCodeScanner", {
                roomName: route.params.title,
                roomId: route.params.roomId,
              });
            }}
          >
            <Ionicons name="qr-code-outline" size={30} color={COLORS.icon} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => handlePresentModalAdd()}>
            <Ionicons name="add-outline" size={30} color={COLORS.icon} />
          </TouchableOpacity> */}
        </View>
        <DraxProvider>
          <ScrollView contentContainerStyle={styles.containerDevice}>
            {dataDevices.map((item) => {
              return (
                <DraxView
                  key={item._id}
                  draggingStyle={styles.dragging}
                  dragReleasedStyle={styles.dragging}
                  dragPayload={{
                    id: item._id,
                    // homeId: item.homeId,
                    roomId: item.roomId,
                    // uid: route.params.uid,
                  }}
                  longPressDelay={300}
                  onDragStart={() => {
                    setIsShowDelete(true);
                  }}
                  onDragEnd={() => {
                    setIsShowDelete(false);
                  }}
                >
                  <CardDevice
                    iconName={item.iconName}
                    title={item.nameDevice}
                    subTitle={item.consumes}
                    idDevice={item._id}
                    nameRoom={item.roomName}
                    homeId={item.homeId}
                    statusOnOff={item.status}
                    roomId={item.roomId}
                    uid={route.params.uid}
                  />
                </DraxView>
              );
            })}
          </ScrollView>
          <DraxView
            style={[
              styles.zoneDeleteDevice,
              { display: isShowDelete ? "flex" : "none" },
            ]}
            onReceiveDragDrop={(event) => {
              handleDeleteDevice(event.dragged.payload || "?");
              setIsShowDelete(false);
            }}
          >
            <Ionicons name="trash-bin-outline" color="white" size={50} />
          </DraxView>
        </DraxProvider>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRed}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetModal}
      >
        <View
          style={{
            flex: 1,
            padding: SIZES.background,
          }}
        >
          {strDevice == "Smart Light" ? (
            <LightBottomSheet />
          ) : strDevice == "Smart Fan" ? (
            <FanBottomSheet />
          ) : (
            <Text>TV</Text>
          )}
        </View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={bottomSheetModalRedAdd}
        index={0}
        snapPoints={snapPointsAdd}
        backgroundStyle={styles.bottomSheetModal}
      >
        <AddDevice
          room={route.params.title}
          roomId={route.params.roomId}
          homeId={route.params.homeId}
          handleCloseModalAdd={handleCloseModalAdd}
          listDiviceAdd={dataDevice}
          uid={route.params.uid}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.background,
  },
  containerTitle: {
    paddingTop: 30,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.title,
    fontSize: SIZES.title,
    fontWeight: "bold",
    marginLeft: SIZES.background,
  },
  containerDevice: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
  },
  bottomSheetModal: {
    flex: 1,
    backgroundColor: COLORS.cardItem,
  },
  cardContainer: {
    backgroundColor: "red",
  },
  zoneDeleteDevice: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    borderStyle: "dashed",
    position: "absolute",
    bottom: 50,
    left: "50%", // căn giữa theo chiều ngang
    marginLeft: -100, // điều chỉnh vị trí căn giữa theo chiều ngang
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
  },
  dragging: {
    opacity: 0.2,
  },
});
