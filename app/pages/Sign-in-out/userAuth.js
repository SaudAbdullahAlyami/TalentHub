import React, { useState, useEffect } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../Setting/settings.screen";
import { CoachProfile } from "../coach/profile";
import { PlayerFormation } from "../player/PlayerFormation";
import { CoachEdit } from "../coach/edit";
import { CoachFormation } from "../coach/CoachFormation";
import { CoachFormationAdd } from "../coach/CoachFormationAdd";
import { PlayerProfile } from "../player/PlayerProfile";
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
import { ScoutVisitProfile } from "../scout/ScoutVisitProfile";
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
import { TournamentVisitProfile } from "../tournament/TournamentVisitProfile";
import { CoachVisitTourPage } from "../coach/CoachVisitTourPage";
import { PlayerVisitCoach } from "../player/PlayerVisitCoach";
import { CoachSeeTournament } from "../coach/CoachSeeTournament";
import { PlayerSeeTournament } from "../player/PlayerSeeTournament";
import { db, auth } from "../../component/config/config";
import { doc, onSnapshot } from "firebase/firestore";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserAuth = () => {
  const [type, setType] = useState("");
  var [clubName, setClubName] = useState("");
  var [tournament, setTournament] = useState("");
  const sub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    setType(doc.data().role);
    setClubName(doc.data().clubName);
    setTournament(doc.data().tournament);
  });

  // ========================================= COACH =========================================================================
  // =========================================================================================================================

  //profile stack coach
  const CoachProfileStack = createStackNavigator();
  function CoachProfilestack({ navigation }) {
    return (
      <CoachProfileStack.Navigator
        screenOptions={{ headerShown: false, initialRouteName: "CoachProfile" }}
      >
        <CoachProfileStack.Screen
          name="CoachProfile"
          component={CoachProfile}
        />
        <CoachProfileStack.Screen name="CoachEdit" component={CoachEdit} />
      </CoachProfileStack.Navigator>
    );
  }

  //formation stack coach
  const CoachFormationStack = createStackNavigator();
  function CoachFormationstack({ navigation }) {
    return (
      <CoachFormationStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "CoachFormation",
        }}
      >
        <CoachFormationStack.Screen
          name="CoachFormation"
          component={CoachFormation}
        />
        <CoachFormationStack.Screen
          name="CoachFormationAdd"
          component={CoachFormationAdd}
        />
        <CoachFormationStack.Screen
          name="AddplayerToformation"
          component={AddplayerToformation}
        />
        <CoachFormationStack.Screen
          name="AddingPlayersManualy"
          component={AddingPlayersManualy}
        />
        <CoachFormationStack.Screen
          name="PlayerRecommendationPage"
          component={PlayerRecommendationPage}
        />
        <CoachFormationStack.Screen
          name="CoachVisitProfile"
          component={CoachVisitProfile}
        />
      </CoachFormationStack.Navigator>
    );
  }

  const CoachJoiningTourStack = createStackNavigator();
  function CoachJoiningTourstack({ navigation }) {
    return (
      <CoachJoiningTourStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "CoachJoiningTournament",
        }}
      >
        <CoachJoiningTourStack.Screen
          name="CoachJoiningTournament"
          component={CoachJoiningTournament}
        />
        <CoachJoiningTourStack.Screen
          name="CoachJoiningTourPage"
          component={CoachVisitTourPage}
        />
      </CoachJoiningTourStack.Navigator>
    );
  }

  //Notification stack coach
  const CoachNotificationStack = createStackNavigator();
  function CoachNotificationstack({ navigation }) {
    return (
      <CoachNotificationStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "CoachNotification",
        }}
      >
        <CoachNotificationStack.Screen
          name="CoachNotification"
          component={CoachNotification}
        />
        <CoachNotificationStack.Screen
          name="CoachVisitProfile"
          component={CoachVisitProfile}
        />
      </CoachNotificationStack.Navigator>
    );
  }
  // =========================================================================================================================

  // ========================================= PLAYER =========================================================================
  // =========================================================================================================================

  // profile player
  const PlayerProfilestack = createStackNavigator();
  function PlayerProfileStack({ navigation }) {
    return (
      <PlayerProfilestack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "Playerprofile",
        }}
      >
        <PlayerProfilestack.Screen
          name="Playerprofile"
          component={PlayerProfile}
        />
        <PlayerProfilestack.Screen name="PlayerEdit" component={PlayerEdit} />
        <PlayerProfilestack.Screen
          name="PlayerVisitProfile"
          component={PlayerVisitProfile}
        />
      </PlayerProfilestack.Navigator>
    );
  }
  //formation stack player
  const PlayerFormationStack = createStackNavigator();
  function PlayerFormationstack({ navigation }) {
    return (
      <PlayerFormationStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "PlayerFormation",
        }}
      >
        <PlayerFormationStack.Screen
          name="PlayerFormation"
          component={PlayerFormation}
        />
        <PlayerFormationStack.Screen
          name="PlayerVisitProfile"
          component={PlayerVisitProfile}
        />
      </PlayerFormationStack.Navigator>
    );
  }

  const PlayerFormationJoinStack = createStackNavigator();
  function PlayerFormationJoinstack({ navigation }) {
    return (
      <PlayerFormationJoinStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "PlayerFormationJoin",
        }}
      >
        <PlayerFormationJoinStack.Screen
          name="PlayerFormationJoin"
          component={PlayerFormationJoin}
        />
        <PlayerFormationJoinStack.Screen
          name="PlayerVisitCoach"
          component={PlayerVisitCoach}
        />
      </PlayerFormationJoinStack.Navigator>
    );
  }

  const PlayerNotificationStack = createStackNavigator();
  function PlayerNotificationstack({ navigation }) {
    return (
      <PlayerNotificationStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "PlayerNotification",
        }}
      >
        <PlayerNotificationStack.Screen
          name="PlayerNotification"
          component={PlayerNotification}
        />
        <PlayerNotificationStack.Screen
          name="PlayerVisitCoach"
          component={PlayerVisitCoach}
        />
      </PlayerNotificationStack.Navigator>
    );
  }

  // =========================================================================================================================

  // ========================================= SCOUT =========================================================================
  // =========================================================================================================================
  // profile Scout
  const ScoutProfilestack = createStackNavigator();
  function ScoutProfileStack({ navigation }) {
    return (
      <ScoutProfilestack.Navigator
        screenOptions={{ headerShown: false, initialRouteName: "ScoutProfile" }}
      >
        <ScoutProfilestack.Screen
          name="ScoutProfile"
          component={ScoutProfile}
        />
        <ScoutProfilestack.Screen name="ScoutEdit" component={ScoutEdit} />
      </ScoutProfilestack.Navigator>
    );
  }

  const ScoutRecommendationStack = createStackNavigator();
  function ScoutRecommendationstack({ navigation }) {
    return (
      <ScoutRecommendationStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "ScoutRecommendation",
        }}
      >
        <ScoutRecommendationStack.Screen
          name="ScoutRecommendation"
          component={ScoutRecommendation}
        />
        <ScoutRecommendationStack.Screen
          name="ScoutVisitProfile"
          component={ScoutVisitProfile}
        />
      </ScoutRecommendationStack.Navigator>
    );
  }

  // =========================================================================================================================

  // ========================================= TOURNAMENT =========================================================================
  // =========================================================================================================================
  // profile Tournament
  const TournamentProfilestack = createStackNavigator();
  function TournamentProfileStack({ navigation }) {
    return (
      <TournamentProfilestack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "TournamentProfile",
        }}
      >
        <TournamentProfilestack.Screen
          name="TournamentProfile"
          component={TournamentProfile}
        />
        <TournamentProfilestack.Screen
          name="TournamentEdit"
          component={TournamentEdit}
        />
      </TournamentProfilestack.Navigator>
    );
  }

  // TournamentShowTeams Stack
  const TournamentShowTeamsStack = createStackNavigator();
  function TournamentShowTeamsstack({ navigation }) {
    return (
      <TournamentShowTeamsStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "TournamentShowTeams",
        }}
      >
        <TournamentShowTeamsStack.Screen
          name="TournamentShowTeams"
          component={TournamentShowTeams}
        />
        <TournamentShowTeamsStack.Screen
          name="TournamentVisitProfile"
          component={TournamentVisitProfile}
        />
      </TournamentShowTeamsStack.Navigator>
    );
  }

  const ExistingTournamentstack = createStackNavigator();
  function ExistingTournamentStack({ navigation }) {
    return (
      <ExistingTournamentstack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "ExistingTournament",
        }}
      >
        <ExistingTournamentstack.Screen
          name="ExistingTournament"
          component={ExistingTournament}
        />
        <ExistingTournamentstack.Screen
          name="TournamentOrgRating"
          component={TournamentOrgRating}
        />
      </ExistingTournamentstack.Navigator>
    );
  }

  // Notification Tournament Stack
  const TournamentNotificationStack = createStackNavigator();
  function TournamentNotificationstack({ navigation }) {
    return (
      <TournamentNotificationStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: "TournamentNotification",
        }}
      >
        <TournamentNotificationStack.Screen
          name="TournamentNotification"
          component={TournamentNotification}
        />
        <TournamentNotificationStack.Screen
          name="TournamentVisitProfile"
          component={TournamentVisitProfile}
        />
      </TournamentNotificationStack.Navigator>
    );
  }
  // =========================================================================================================================

  ///============================================== MAIN ===================================================================
  if (type === "Player") {
    return (
      <Tab.Navigator
        initialRouteName={"PlayerProfile"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#00B365',
        tabBarInactiveTintColor: 'grey',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            const rn = route.name;

            if (rn === "PlayerProfile") {
              iconName = focused ? 'person' : 'person-outline';
            } else if (rn === "PlayerFormationJoinstack") {
              iconName = focused ? 'football' : 'football-outline';
            } else if (rn === "PlayerFormationstack") {
              iconName = focused ? 'football' : 'football-outline';
            } else if (rn === "PlayerSeeTournament") {
              iconName = focused ? "trophy" : "trophy-outline";
            } else if (rn === "PlayerNotificationstack") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (rn === "Settings") {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        
      >
        <Tab.Screen name="PlayerProfile" component={PlayerProfileStack} />

        {/* Render PlayerFormationJoinstack or PlayerFormationstack based on whether the player has a team */}
        {clubName === "" ? (
          <Tab.Screen name="PlayerFormationJoinstack" component={PlayerFormationJoinstack} />
        ) : (
          <Tab.Screen name="PlayerFormationstack" component={PlayerFormationstack} />
        )}

        {/* Render PlayerSeeTournament based on whether there's an active tournament */}
        {tournament !== "" && (
          <Tab.Screen name="PlayerSeeTournament" component={PlayerSeeTournament} />
        )}

        <Tab.Screen name="PlayerNotificationstack" component={PlayerNotificationstack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  } else if (type === "Coach") {
    return (
      <Tab.Navigator
        initialRouteName={"CoachProfileStack"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#00B365',
        tabBarInactiveTintColor: 'grey',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            const rn = route.name;

            if (rn === "CoachProfileStack") {
              iconName = focused ? 'person' : 'person-outline';
            } else if (rn === "CoachNotificationstack") {
              iconName = focused ? "notifications" : "notifications-outline"
            } else if (rn === "CoachSeeTournament") {
              iconName = focused ? "trophy" : 'trophy-outline';
            } else if (rn === "CoachJoiningTourstack") {
              iconName = focused ? "trophy" : 'trophy-outline';
            }

            else if (rn === "CoachFormationstack") {
              iconName = focused ? 'football' : 'football-outline';
            } else if (rn === "Settings") {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
    
      >
        <Tab.Screen name="CoachProfileStack" component={CoachProfilestack} />
        <Tab.Screen
          name="CoachFormationstack"
          component={CoachFormationstack}
        />

        {tournament !== "" ? (
          <Tab.Screen
            name="CoachSeeTournament"
            component={CoachSeeTournament}
          />
        ) : (
          <Tab.Screen
            name="CoachJoiningTourstack"
            component={CoachJoiningTourstack}
          />
        )}
        <Tab.Screen
          name="CoachNotificationstack"
          component={CoachNotificationstack}
        />

        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  } else if (type === "Scout") {
    return (
      <Tab.Navigator
      initialRouteName={"ScoutProfileStack"}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#00B365',
        tabBarInactiveTintColor: 'grey',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const rn = route.name;

          if (rn === "ScoutProfileStack") {
            iconName = focused ? 'person' : 'person-outline';
          }  else if (rn === "Tournamet") {
            iconName = focused ? "trophy" : 'trophy-outline';
          } else if (rn === "ScoutRecommendationstack") {
            iconName = focused ? "desktop" : 'desktop-outline';
          } else if (rn === "Settings") {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
   
    >
        <Tab.Screen name="ScoutProfileStack" component={ScoutProfileStack} />
        <Tab.Screen name="Tournamet" component={ScoutProfileStack} />
        <Tab.Screen
          name="ScoutRecommendationstack"
          component={ScoutRecommendationstack}
        />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  } else if (type === "Tournament Organizer") {
    return (
      <Tab.Navigator
      initialRouteName={"TournamentProfileStack"}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00B365',
        tabBarInactiveTintColor: 'grey',
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const rn = route.name;

          if (rn === "TournamentProfileStack") {
            iconName = focused ? 'person' : 'person-outline';
          } else if (rn === "TournamentNotificationstack") {
            iconName = focused ? "notifications" : "notifications-outline"
          } else if (rn === "CreateTournament") {
            iconName = focused ? "trophy" : 'trophy-outline';
          } else if (rn === "ExistingTournamentStack") {
            iconName = focused ? "trophy" : 'trophy-outline';
          }

          else if (rn === "TournamentShowTeamsstack") {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (rn === "Settings") {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
     
    >
        <Tab.Screen
          name="TournamentProfileStack"
          component={TournamentProfileStack}
        />
        {tournament == "" ? (
          <Tab.Screen name="CreateTournament" component={CreateTournament} />
        ) : (
          <>
            <Tab.Screen
              name="ExistingTournamentStack"
              component={ExistingTournamentStack}
            />
            <Tab.Screen
              name="TournamentShowTeamsstack"
              component={TournamentShowTeamsstack}
            />
          </>
        )}
        <Tab.Screen
          name="TournamentNotificationstack"
          component={TournamentNotificationstack}
        />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }
};
