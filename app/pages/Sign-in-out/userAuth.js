import React, { useState } from "react";
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";
import { CoachProfile } from "../coach/profile";
import {Formation} from "../player/formation"
import { CoachEdit } from "../coach/edit";
import { CoachFormation } from "../coach/CoachFormation";
import { CoachFormationAdd } from "../coach/CoachFormationAdd";
import {PlayerProfile} from "../player/PlayerProfile"
import { PlayerEdit } from "../player/PlayerEdit";
import { CoachNotification } from "../coach/CoachNotification";
import { PlayerNotification } from "../player/PlayerNotification";
import { PlayerFormationJoin } from "../player/PlayerFormationJoin";
import { db,auth } from "../../component/config/config";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserAuth = () => {
  const [type,setType]=useState('')
  const [clubName,setClubName]=useState('')
  const unsub= onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    setType(doc.data().role)
    setClubName(doc.data().clubName)
  });
//profile stack coach
  const CoachProfileStack = createStackNavigator();
  function CoachProfilestack ({ navigation }){
    return(
      <CoachProfileStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachProfile" }}>
        <CoachProfileStack.Screen name="CoachProfile" component={CoachProfile}/>
        <CoachProfileStack.Screen name="CoachEdit" component={CoachEdit}/>
      </CoachProfileStack.Navigator>
    )
  }

//formation stack coach
const CoachFormationStack = createStackNavigator();
  function CoachFormationstack ({ navigation }){
    return(
      <CoachFormationStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachFormation" }}>
        <CoachFormationStack.Screen name="CoachFormation" component={CoachFormation}/>
        <CoachFormationStack.Screen name="CoachFormationAdd" component={CoachFormationAdd}/>
      </CoachFormationStack.Navigator>
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







///MMMMMMMMMMMMMAAAAAAAAAAAAAIIIIIIIIIIIIINNNNNNNNNNN
if (type === "Player") {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "PlayerProfile" }}>
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="PlayerProfile" component={PlayerProfileStack} />

{/* if player doesn't have a team 
    and if he has a team        */}
      {clubName === '' ? (
        <Tab.Screen name="PlayerFormationJoin" component={PlayerFormationJoin} />
      ) : (
        <Tab.Screen name="Formation" component={Formation} />
      )}
      
      <Tab.Screen name="PlayerNotification" component={PlayerNotification} />
    </Tab.Navigator>
  );
} else if (type === "Coach") {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachProfileStack" }}>
      <Tab.Screen name="CoachProfileStack" component={CoachProfilestack} />
      <Tab.Screen name="CoachFormationstack" component={CoachFormationstack} />
      <Tab.Screen name="CoachNotification" component={CoachNotification} />
    </Tab.Navigator>
  );
}
}