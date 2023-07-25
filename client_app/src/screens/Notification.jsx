import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CardNotification from "../components/CardNotification";
import { COLORS, SIZES } from "../styles/theme";
import { useUser } from "../api/userContext";
import { Swipeable } from "react-native-gesture-handler";
export default function Notification({ navigation }) {
  const { getListNotification, notification, deleteNotification } = useUser();
  const [notificationDetail, setNotificationDetail] = useState();
  const [isShowNotificationDetail, setIsShowNotificationDetail] =
    useState(false);

  useEffect(() => {
    getListNotification();
  }, []);

  const handleDeleteNotification = (notificationId) => {
    return () => {
      deleteNotification({ notificationId: notificationId });
    };
  };

  const handleNotificationDetail = (notificationId) => {
    return () => {
      const notificationDetail = notification.filter(
        (item) => item._id === notificationId
      );
      setNotificationDetail(notificationDetail[0]);
      setIsShowNotificationDetail(true);
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: SIZES.background }}>
        <View style={styles.editProfileTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color={COLORS.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
        </View>
        <ScrollView>
          {notification &&
            notification.map((item) => {
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
                      <Text style={{ color: "white" }}>Delete</Text>
                    </Animated.View>
                  )}
                  rightThreshold={Dimensions.get("screen").width * 0.9} // kích thước phần tử được xóa khi vuốt sang phải
                  onSwipeableRightWillOpen={handleDeleteNotification(item._id)}
                >
                  <CardNotification notification={item} />
                </Swipeable>
              );
            })}
        </ScrollView>
      </View>

      <View
        style={[
          styles.notification,
          { display: isShowNotificationDetail ? "flex" : "none" },
        ]}
      >
        <View style={styles.boxNotification}>
          <View
            style={{
              width: "100%",
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.titleNotification}>
              {notificationDetail?.title}
            </Text>
            <TouchableOpacity
              onPress={() => setIsShowNotificationDetail(false)}
            >
              <Ionicons name="close" size={30} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitleNotification}>
            {notificationDetail?.subTitle}
          </Text>
        </View>
      </View>
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
    flexDirection: "row",
    alignItems: "flex-start",
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: "bold",
    color: COLORS.title,
    marginLeft: 10,
    marginBottom: 40,
  },

  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    height: 70,
    width: 70,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 70,
  },
  backRightBtnRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "red",
    right: 0,
  },
  notification: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "#00000099",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  boxNotification: {
    backgroundColor: "white",
    width: "100%",
    height: "30%",
    borderRadius: 10,
    padding: 10,
  },
  titleNotification: {
    fontSize: 30,
  },
  subTitleNotification: {
    fontSize: 20,
  },
});
