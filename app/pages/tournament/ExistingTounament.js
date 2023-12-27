import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from "react-native-paper";
import { useAuthentication } from "../../useAuthentication";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth, firebase } from "../../component/config/config";

export const ExistingTournament = ({ navigation }) => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchData();
      
      // Clean up the subscription when the component unmounts
     
    }, []);
    
    const fetchData = async (navigation) => {
      const tournamentOrganizer = doc(db, "users", auth.currentUser.uid);
      const tournamentOrganizerUnsubscribe = onSnapshot(tournamentOrganizer, async (orgDoc) => {
        if (orgDoc.exists()) {
          const tournamentName = orgDoc.data().tournamentName;
      
          const tournamentDoc = doc(db, "tournament", tournamentName);
          const tournamentUnsubscribe = onSnapshot(tournamentDoc, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const tournamentData = docSnapshot.data();
              if (tournamentData.teams) {
                setTeams(tournamentData.teams);
                console.log("Teams updated in real-time");
              }
            } else {
              console.log("Tournament document does not exist");
            }
          });
        } else {
          console.log("Tournament organizer document does not exist");
        }
      });
      
    
    }




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teams List</Text>
      <FlatList
  data={teams}
  keyExtractor={(item) => item.name}
  renderItem={({ item }) => (
    <View style={styles.teamContainer}>
      <Text style={styles.teamName}>{item.name}</Text>
      {item.players.length > 0 && (
        <Text style={styles.playersCount}>
          First Player Age: {item.players[0].age}
          First Player Age: {item.players[1].age}
        </Text>
      )}
    </View>
  )}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  teamContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    width: "100%",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  playersCount: {
    color: "#555",
  },
});


