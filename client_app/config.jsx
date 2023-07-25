import firebase from "firebase/compat/app"
import { getDatabase } from "firebase/database";
import "firebase/compat/auth";
import firebaseStorage from "firebase/compat/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";

// const firebaseConfig = {
//   apiKey: "AIzaSyCZijuSXDdxhUluXdaZMaS3j7rJ6Tqt95g",
//   authDomain: "smarthomereactnative.firebaseapp.com",
//   projectId: "smarthomereactnative",
//   storageBucket: "smarthomereactnative.appspot.com",
//   messagingSenderId: "920737450323",
//   appId: "1:920737450323:web:b3cf1cb60050058638f9a6",
//   measurementId: "G-T8D5KD4ZPC",
// };
const firebaseConfig = {
  apiKey: "AIzaSyCbH9VGwJKK80bGK1hS6bGS_UJl-C_ZTy8",
  authDomain: "smart-home-bdee6.firebaseapp.com",
  projectId: "smart-home-bdee6",
  storageBucket: "smart-home-bdee6.appspot.com",
  messagingSenderId: "365901280985",
  appId: "1:365901280985:web:d9b3b035a0b4405d6170c8",
  measurementId: "G-GSPWVHHLYN"
};


if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const fireApp = firebase.initializeApp(firebaseConfig);
const storage = firebaseStorage;
// const db = getDatabase();

initializeAuth(fireApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export {  firebaseConfig, storage, firebase };
