import React, { useState } from "react";
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";
import { CoachProfile } from "../coach/profile";
import {Formation} from "../player/formation"
import { CoachEdit } from "../coach/edit";
import { CreateClub } from "../coach/CreateClub";
import { CoachFormation } from "../coach/CoachFormation";
import {PlayerProfile} from "../player/PlayerProfile"
import { PlayerEdit } from "../player/PlayerEdit";
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
//profile coach
  const CoachProfileStack = createStackNavigator();
  function CoachProfilestack ({ navigation }){
    return(
      <CoachProfileStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachProfile" }}>
        <CoachProfileStack.Screen name="CoachProfile" component={CoachProfile}/>
        <CoachProfileStack.Screen name="CoachEdit" component={CoachEdit}/>
      </CoachProfileStack.Navigator>
    )
  }


 // profile player
 const PlayerProfilestack = createStackNavigator();
 function PlayerProfileStack ({ navigation }){
   return(
     <PlayerProfilestack.Navigator screenOptions={{ headerShown: false, initialRouteName: "Playerprofile" }}>
       <PlayerProfilestack.Screen name="Playerprofile" component={PlayerProfile}/>
       <PlayerProfilestack.Screen name="PlayerEdit" component={PlayerEdit}/>
     </PlayerProfilestack.Navigator>
   )
 }


if (type == "Player")
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "PlayerProfile" }}>
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="PlayerProfile" component={PlayerProfileStack} />
      <Tab.Screen name="Formation" component={Formation} />
    </Tab.Navigator>
    )
    else if (type == "Coach")
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachProfileStack" }}>
        <Tab.Screen name="CoachProfileStack" component={CoachProfilestack} />
        <Tab.Screen name="CreateClub" component={CreateClub} />
        <Tab.Screen name="CoachFormation" component={CoachFormation} />
      </Tab.Navigator>
      )
}