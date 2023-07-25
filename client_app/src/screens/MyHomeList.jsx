import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useUser } from "../api/userContext";
import { Swipeable } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { COLORS, SIZES } from "../styles/theme";

export default function MyHomeList({ navigation }) {
  const { home, homeId, deleteHome, updateHomeName, user } = useUser();
  const [nameHome, setNameHome] = useState("");
  const [homeIdEdit, setHomeIdEdit] = useState("");
  const bottomSheetModalRed = useRef(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const handleOpenBottomSheep = (nameHome, homeIdEdit) => {
    bottomSheetModalRed.current?.present();
    setNameHome(nameHome);
    setHomeIdEdit(homeIdEdit);
  };
  const handleCloseBottomSheet = () => {
    bottomSheetModalRed.current?.close();
  };

  const handleDeleteHome = (id) => {
    return () => {
      if (id !== homeId) {
        deleteHome({ id: id });
      } else {
        Alert.alert(
          "Delete Home failed",
          "You cannot delete this house because you are currently accessing it.",
          [
            {
              text: "OK",
            },
          ]
        );
      }
    };
  };

  const handleUpdateHome = () => {
    const data = {
      nameHome: nameHome,
      homeId: homeIdEdit,
    };
    updateHomeName(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModalProvider>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.title}>List My Home</Text>
        </View>
        <View style={styles.main}>
          {home &&
            home.map((item) => {
              let totalDevice = 0;
              item.roomId.map((item) => {
                totalDevice += item.devicesId.length;
              });
              return (
                <Swipeable
                  key={item._id}
                  renderRightActions={(_, dragX) => (
                    <Animated.View
                      style={[
                        styles.deleteButton,
                        {
                          opacity: dragX.interpolate({
                            inputRange: [0, 75],
                            outputRange: [0, 1],
                            extrapolate: "clamp",
                          }),
                        },
                      ]}
                    >
                      <Text style={{ color: "white" }}> </Text>
                    </Animated.View>
                  )}
                  rightThreshold={Dimensions.get("screen").width * 0.9} // kích thước phần tử được xóa khi vuốt sang phải
                  onSwipeableRightWillOpen={handleDeleteHome(item._id)}
                >
                  <View style={styles.cardUser}>
                    <TouchableOpacity
                      onPress={() =>
                        handleOpenBottomSheep(item.nameHome, item._id)
                      }
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>
                        {item.nameHome}
                      </Text>
                    </TouchableOpacity>
                    <Text style={{ color: "white", fontSize: 18 }}>
                      Total Room: {item.roomId.length}
                    </Text>
                    <Text style={{ color: "white", fontSize: 18 }}>
                      Total Device: {totalDevice}
                    </Text>
                  </View>
                </Swipeable>
              );
            })}
          <BottomSheetModal
            ref={bottomSheetModalRed}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={styles.bottomSheet}
          >
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
              <View style={styles.headerBottomSheet}>
                <Text style={styles.headerTitle}>Update Name Home</Text>
                <TouchableOpacity onPress={handleCloseBottomSheet}>
                  <Ionicons
                    name="close-outline"
                    color={COLORS.icon}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.bodyBottomSheet}>
                <BottomSheetTextInput
                  placeholderTextColor={COLORS.subTitle}
                  onChangeText={setNameHome}
                  value={nameHome}
                  style={styles.textInput}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleUpdateHome();
                    handleCloseBottomSheet();
                  }}
                  // disabled={numberPhone ? false : true}
                >
                  <Text style={styles.titleButton}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetModal>
        </View>
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
  header: {
    padding: 15,
    flexDirection: "row",
  },
  main: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: "bold",
    color: COLORS.title,
    marginLeft: 10,
  },
  cardUser: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.cardItem,
    borderRadius: 8,
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  bottomSheet: {
    backgroundColor: "#18191a",
  },
  headerBottomSheet: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.title,
    fontSize: 24,
    fontWeight: "bold",
  },
  bodyBottomSheet: {
    flex: 1,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.title,
    borderRadius: 8,
    color: COLORS.title,
    fontSize: 20,
    padding: SIZES.background,
    marginBottom: SIZES.background,
    marginTop: 20,
  },
  button: {
    height: 60,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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
});
