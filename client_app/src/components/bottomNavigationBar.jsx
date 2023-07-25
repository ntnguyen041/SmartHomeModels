import  React, {useContext} from 'react';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import AutonationScreens from '../screens/AutonationScreen';
import SettingScreens from '../screens/SettingScreen';
import {COLORS} from "../styles/theme"


const homeName = 'Home';
const roomName = 'Schedule';
const autonationName = 'Autonation';
const settingName = 'User';

const Tab = createBottomTabNavigator();

export default function BottomNavigationBarCustom() {
  return (
    //<NavigationContainer>
      <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.title,
          tabBarInactiveTintColor: COLORS.title,
          // tabBarShowLabel: false,
          tabBarStyle: {
            height: Dimensions.get("window").height /11,
            paddingTop: 10,
            borderTopColor: COLORS.background,
            backgroundColor: COLORS.background,
            // position: 'absolute',            
          },
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconSize;
            let iconColor;
            let rn = route.name;
            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';
              iconColor = focused ? iconColor = COLORS.title : iconColor = COLORS.subTitle;
            } else if (rn === roomName) {
              iconName = focused ? 'time' : 'time-outline';
              iconColor = focused ? iconColor = COLORS.title : iconColor = COLORS.subTitle;
            } else if (rn === autonationName) {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              iconColor = focused ? iconColor = COLORS.title : iconColor = COLORS.subTitle;
            } else if (rn === settingName) {
              iconName = focused ? 'person' : 'person-outline';
              iconColor = focused ? iconColor = COLORS.title : iconColor = COLORS.subTitle;
            }
            return <Ionicons name={iconName} size={30} color={iconColor} />
          },
        })}>
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={roomName} component={ScheduleScreen} />
        <Tab.Screen name={autonationName} component={AutonationScreens} />
        <Tab.Screen name={settingName} component={SettingScreens} />
      </Tab.Navigator>
    //</NavigationContainer>
  )
}
