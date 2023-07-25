import React, {useState} from 'react'
import {View, Text, TouchableOpacity, Image, TextInput, SafeAreaView, StyleSheet, Dimensions} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import imgContact from "../../assets/ContactUs.png";
import {COLORS, SIZES} from "../styles/theme"

export default function ContactUs({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: SIZES.background }}>
        <View style={styles.editProfileTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color={COLORS.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>Contact us</Text>
        </View>
        <View style={styles.editProfileCenter}>
          <Image source={imgContact} style={styles.image} />
        </View>
        <KeyboardAwareScrollView
        scrollEnabled={false}
        >
          <View style={styles.editProfileBottom}>
            <Text style={styles.titleInput}>Full Name</Text>
            <TextInput style={styles.textInput} />
            <Text style={styles.titleInput}>Email Address</Text>
            <TextInput style={styles.textInput} />
            <Text style={styles.titleInput}>Message</Text>
            <TextInput  placeholder="Enter your message..." placeholderTextColor='grey' multiline  style={[styles.textInput, {height: 150}]} />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.button}>
          <TouchableOpacity style={styles.buttonCenter}>
            <Text style={styles.titleButton}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.background,
    padding: SIZES.background,
  },
  editProfileTop: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    // backgroundColor: "red",
  },
  editProfileCenter: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40
    // backgroundColor: "blue",
  },
  editProfileBottom: {
    flex: 9,
    // backgroundColor: "green",
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: "bold",
    color: COLORS.title,
    marginLeft: 10,
  },
  image: {
    width: Dimensions.get("screen").width / 2,
    height: Dimensions.get("screen").width / 2,
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
  textInput: {
    height: 60,
    // margin: 12,
    borderWidth: 2,
    padding: 10,
    borderColor: COLORS.subTitle,
    color: COLORS.title,
    fontSize: 18,
    borderRadius: 8,
    marginBottom: SIZES.background,
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
    color: "black",
  },
});
