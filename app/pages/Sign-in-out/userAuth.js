import React, { useState } from "react";
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";
import { CoachProfile } from "../coach/profile";
import {formation} from "../player/formation"
import { CoachEdit } from "../coach/edit";
import {PlayerProfile} from "../player/PlayerProfile"
import { db,auth } from "../../component/config/config";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserAuth = () => {
  const [type,setType]=useState('')

  const unsub= onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    setType(doc.data().role)
  });

  const CoachProfileStack = createStackNavigator();
  function CoachProfilestack ({ navigation }){
    return(
      <CoachProfileStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachProfile" }}>
        <CoachProfileStack.Screen name="CoachProfile" component={CoachProfile}/>
        <CoachProfileStack.Screen name="CoachEdit" component={CoachEdit}/>
      </CoachProfileStack.Navigator>
    )
  }
  
if (type == "Player")
  return (
    <Tab.Navigator>
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="PlayerProfile" component={PlayerProfile} />
      <Tab.Screen name="formation" component={formation} />
    </Tab.Navigator>
    )
    else if (type == "Coach")
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, }}>
        <Tab.Screen name="CoachProfileStack" component={CoachProfilestack} />
      </Tab.Navigator>
      )
}