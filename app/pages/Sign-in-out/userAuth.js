import React, { useState } from "react";
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";
import { db } from "../../component/config/config";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserAuth = () => {
  const unsub = onSnapshot(doc(db, "users", "RjEwQhGoqsgCG2jJ27A8UQ1Wds93"), (doc) => {
    var type="";
    type=doc.data().role
    console.log("Current data: ", doc.data()); 
    console.log("Role data: ", type); 
  });

  return (
    <Tab.Navigator>
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
    )
}