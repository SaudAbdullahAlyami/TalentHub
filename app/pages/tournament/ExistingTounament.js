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
        try {
            const tournamentOrgnaizer = await getDoc(doc(db, "users", auth.currentUser.uid));
            const tournamentName=tournamentOrgnaizer.data().tournamentName;

            const tournamentDoc = await getDoc(doc(db, "tournament", tournamentName));
      
            if (tournamentDoc.exists()) {
              const tournamentData = tournamentDoc.data();
              if (tournamentData.teams) {
                setTeams(tournamentData.teams);
                console.log("Teams fetched")
              }
            } else {
              console.log("Tournament document does not exist");
            }

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };





  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teams List</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.playersCount}>
              Players Count: {item.players.length}
            </Text>
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


