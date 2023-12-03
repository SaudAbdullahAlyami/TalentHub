import React, { useState } from "react";
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";
import { CoachProfile } from "../coach/profile";
import {PlayerProfile} from "../player/PlayerProfile"
import {formation} from "../player/formation"
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
    console.log("Current data: ", doc.data()); 
 
  });
  
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
      <Tab.Navigator>
        <Tab.Screen name="CoachProfile" component={CoachProfile} />
      </Tab.Navigator>
      )
}