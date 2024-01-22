import React, { useState, useEffect } from "react";
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";
import { CoachProfile } from "../coach/profile";
import { PlayerFormation } from "../player/PlayerFormation"
import { CoachEdit } from "../coach/edit";
import { CoachFormation } from "../coach/CoachFormation";
import { CoachFormationAdd } from "../coach/CoachFormationAdd";
import { PlayerProfile } from "../player/PlayerProfile"
import { PlayerEdit } from "../player/PlayerEdit";
import { CoachNotification } from "../coach/CoachNotification";
import { PlayerNotification } from "../player/PlayerNotification";
import { PlayerFormationJoin } from "../player/PlayerFormationJoin";
import { PlayerVisitProfile } from "../player/PlayerVisitProfile";
import { CoachVisitProfile } from "../coach/CoachVisitProfile";
import { PlayerRecommendationPage } from "../coach/PlayerRecommendationPage";
import { ScoutRecommendation } from "../scout/ScoutRecommendation";
import { ScoutProfile } from "../scout/ScoutProfile";
import { ScoutEdit } from "../scout/ScoutEdit";
import { AddingPlayersManualy } from "../coach/AddingPlayersManualy";
import { AddplayerToformation } from "../coach/AddplayerToformation";
import { TournamentEdit } from "../tournament/TournamentEdit";
import { TournamentProfile } from "../tournament/TournamentProfile";
import { CreateTournament } from "../tournament/CreateTournament";
import { ExistingTournament } from "../tournament/ExistingTounament";
import { TournamentNotification } from "../tournament/TournamentNotification";
import { CoachJoiningTournament } from "../coach/CoachJoiningTournament";
import { TournamentOrgRating } from "../tournament/TournamentOrgRating";
import { TournamentShowTeams } from "../tournament/TournamentShowTeams";
import { TournamentView } from "../player/TournamentView";
import { db, auth } from "../../component/config/config";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserAuth = () => {

  const [type, setType] = useState('')
  var [clubName, setClubName] = useState('')
  var [tournament, setTournament] = useState('')
  const sub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    setType(doc.data().role)
    setClubName(doc.data().clubName)
    setTournament(doc.data().tournament)
  });




  //profile stack coach
  const CoachProfileStack = createStackNavigator();
  function CoachProfilestack({ navigation }) {
    return (
      <CoachProfileStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachProfile" }}>
        <CoachProfileStack.Screen name="CoachProfile" component={CoachProfile} />
        <CoachProfileStack.Screen name="CoachEdit" component={CoachEdit} />
      </CoachProfileStack.Navigator>
    )
  }

  //formation stack coach
  const CoachFormationStack = createStackNavigator();
  function CoachFormationstack({ navigation }) {
    return (
      <CoachFormationStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachFormation" }}>
        <CoachFormationStack.Screen name="CoachFormation" component={CoachFormation} />
        <CoachFormationStack.Screen name="CoachFormationAdd" component={CoachFormationAdd} />
        <CoachFormationStack.Screen name="AddplayerToformation" component={AddplayerToformation} />
        <CoachFormationStack.Screen name="AddingPlayersManualy" component={AddingPlayersManualy} />
        <CoachFormationStack.Screen name="PlayerRecommendationPage" component={PlayerRecommendationPage} />
        <CoachFormationStack.Screen name="CoachVisitProfile" component={CoachVisitProfile} />
      </CoachFormationStack.Navigator>
    )
  }

  //Notification stack coach
  const CoachNotificationStack = createStackNavigator();
  function CoachNotificationstack({ navigation }) {
    return (
      <CoachNotificationStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachNotification" }}>
        <CoachNotificationStack.Screen name="CoachNotification" component={CoachNotification} />
        <CoachNotificationStack.Screen name="CoachVisitProfile" component={CoachVisitProfile} />
      </CoachNotificationStack.Navigator>
    )
  }

  
  //formation stack player
  const PlayerFormationStack = createStackNavigator();
  function PlayerFormationstack({ navigation }) {
    return (
      <PlayerFormationStack.Navigator screenOptions={{ headerShown: false, initialRouteName: "PlayerFormation" }}>
        <PlayerFormationStack.Screen name="PlayerFormation" component={PlayerFormation} />
        <PlayerFormationStack.Screen name="PlayerVisitProfile" component={PlayerVisitProfile} />
      </PlayerFormationStack.Navigator>
    )
  }

  // profile player
  const PlayerProfilestack = createStackNavigator();
  function PlayerProfileStack({ navigation }) {
    return (
      <PlayerProfilestack.Navigator screenOptions={{ headerShown: false, initialRouteName: "Playerprofile" }}>
        <PlayerProfilestack.Screen name="Playerprofile" component={PlayerProfile} />
        <PlayerProfilestack.Screen name="PlayerEdit" component={PlayerEdit} />
        <PlayerProfilestack.Screen name="PlayerVisitProfile" component={PlayerVisitProfile} />
      </PlayerProfilestack.Navigator>
    )
  }




  // profile Scout
  const ScoutProfilestack = createStackNavigator();
  function ScoutProfileStack({ navigation }) {
    return (
      <ScoutProfilestack.Navigator screenOptions={{ headerShown: false, initialRouteName: "ScoutProfile" }}>
        <ScoutProfilestack.Screen name="ScoutProfile" component={ScoutProfile} />
        <ScoutProfilestack.Screen name="ScoutEdit" component={ScoutEdit} />
      </ScoutProfilestack.Navigator>
    )
  }




  // profile Tournament
  const TournamentProfilestack = createStackNavigator();
  function TournamentProfileStack({ navigation }) {
    return (
      <TournamentProfilestack.Navigator screenOptions={{ headerShown: false, initialRouteName: "TournamentProfile" }}>
        <TournamentProfilestack.Screen name="TournamentProfile" component={TournamentProfile} />
        <TournamentProfilestack.Screen name="TournamentEdit" component={TournamentEdit} />
      </TournamentProfilestack.Navigator>
    )
  }

  const ExistingTournamentstack = createStackNavigator();
  function ExistingTournamentStack({ navigation }) {
    return (
      <ExistingTournamentstack.Navigator screenOptions={{ headerShown: false, initialRouteName: "ExistingTournament" }}>
        <ExistingTournamentstack.Screen name="ExistingTournament" component={ExistingTournament} />
        <ExistingTournamentstack.Screen name="TournamentOrgRating" component={TournamentOrgRating} />
      </ExistingTournamentstack.Navigator>
    )
  }


  ///MMMMMMMMMMMMMAAAAAAAAAAAAAIIIIIIIIIIIIINNNNNNNNNNN
  if (type === "Player") {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "Playerprofile" }}>
        
        <Tab.Screen name="PlayerProfile" component={PlayerProfileStack} />

        {/* if player doesn't have a team 
    and if he has a team        */}
        {clubName === '' ? (
          <Tab.Screen name="PlayerFormationJoin" component={PlayerFormationJoin} />
        ) : (
          <Tab.Screen name="PlayerFormationstack" component={PlayerFormationstack} />
        )}
        {tournament !== '' && (
          <Tab.Screen name="TournamentView" component={TournamentView} />
        )}
        <Tab.Screen name="PlayerNotification" component={PlayerNotification} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }

  else if (type === "Coach") {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "CoachProfileStack" }}>
        <Tab.Screen name="CoachProfileStack" component={CoachProfilestack} />
        <Tab.Screen name="CoachFormationstack" component={CoachFormationstack} />
        <Tab.Screen name="CoachNotificationstack" component={CoachNotificationstack} />
        <Tab.Screen name="CoachJoiningTournament" component={CoachJoiningTournament} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }
 

  else if (type === "Scout") {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "ScoutProfileStack" }}>
        <Tab.Screen name="ScoutProfileStack" component={ScoutProfileStack} />
        <Tab.Screen name="Tournamet" component={ScoutProfileStack} />
        <Tab.Screen name="ScoutRecommendation" component={ScoutRecommendation} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }

  else if (type === "Tournament Organizer") {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, initialRouteName: "TournamentProfileStack" }}>
        <Tab.Screen name="TournamentProfileStack" component={TournamentProfileStack} />
        {tournament == '' ? (
          <Tab.Screen name="CreateTournament" component={CreateTournament} />
        ) : (
          <>
            <Tab.Screen name="ExistingTournamentStack" component={ExistingTournamentStack} />
            <Tab.Screen name="TournamentShowTeams" component={TournamentShowTeams} />
          </>
        )}
        <Tab.Screen name="TournamentNotification" component={TournamentNotification} />
        <Tab.Screen name="Settings" component={SettingsScreen} />

      </Tab.Navigator>
    );
  }
}