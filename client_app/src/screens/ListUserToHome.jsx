import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useUser } from "../api/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";
import { Swipeable } from "react-native-gesture-handler";
import userNull from "../../assets/userNull.png";

export default function ListUserToHome({ navigation, route }) {
  const { listUserToRoom, deleteUserToRoomId } = useUser();

  const handleDeleteUser = (userId, homeId) => {
    return () => {
      const deteleUser = { userId: userId, homeId: homeId };
      deleteUserToRoomId(deteleUser);
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.title}>List User To Room</Text>
      </View>
      <View style={styles.main}>
        {listUserToRoom &&
          listUserToRoom.map((item) => {
            return (
              <View key={item.id}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                    marginBottom: 10,
                  }}
                >
                  {item.nameHome}
                </Text>
                {item.user.map((user) => {
                  return (
                    <Swipeable
                      key={user._id}
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
                      onSwipeableRightWillOpen={handleDeleteUser(
                        user._id,
                        item.id
                      )}
                    >
                      <View style={styles.cardUser}>
                        {user.imageUser ? (
                          <Image
                            source={{ uri: user.imageUser }}
                            style={styles.image}
                          />
                        ) : (
                          <Image source={userNull} style={styles.image} />
                        )}
                        <Text style={{ color: "white", fontSize: 18 }}>
                          {user.nameUser}
                        </Text>
                        <Text style={{ color: "white", fontSize: 18 }}>
                          {user.phoneUser}
                        </Text>
                      </View>
                    </Swipeable>
                  );
                })}
              </View>
            );
          })}
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
  image: {
    width: Dimensions.get("screen").width / 9,
    height: Dimensions.get("screen").width / 9,
    borderRadius: 8,
  },
});
