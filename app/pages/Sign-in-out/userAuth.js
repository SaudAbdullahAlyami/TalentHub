import React, { useState } from "react";
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserAuth = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
    )
}