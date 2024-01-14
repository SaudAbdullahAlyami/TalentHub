import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,collection,deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../component/config/config";
import { ScrollView } from "react-native-gesture-handler";

export const TournamentView = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [matchups, setMatchups] = useState([]); //8 matchs
  const [matchupsRound2, setMatchupsRound2] = useState([]); //4 matchs
  const [matchupsRound3, setMatchupsRound3] = useState([]); //2 matchs
  const [matchupsRound4, setMatchupsRound4] = useState([]); //2 matchs
  const [round1Complete, setRound1Complete] = useState(false); //to know if round 1 finish
  const [round2Complete, setRound2Complete] = useState(false); //to know if round 2 finish
  const [round3Complete, setRound3Complete] = useState(false); //to know if round 3 finish

  useEffect(() => {
 

    // Call the async function
    //fetchTournamentData();
}, []);

const fetchTournamentData = async () => {
  try {
      const playerDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const clubname=playerDoc.data().clubName
      console.log(clubname)
      const clubDoc = await getDoc(doc(db, "clubs",clubname));
      const tournamentOrganizerRef = clubDoc.data().tournament;

      const unsubscribeOrganizer = onSnapshot(
          tournamentOrganizerRef,
          (organizerDoc) => {
              const tournamentName = organizerDoc.data().tournament;

    if (tournamentName) {
      const tournamentRef = doc(db, "tournament", tournamentName);
      const unsubscribeTournament = onSnapshot(
        tournamentRef,
        (tournamentDoc) => {
          if (tournamentDoc.exists()) {
            const tournamentData = tournamentDoc.data();

            if (tournamentData && tournamentData.matchs) {
              setTeams(tournamentData.teams);
              console.log("Updated team from the database");
              setMatchups(tournamentData.matchs);
              console.log("Matchups updated in real-time");

              const isRound1Complete =
                matchups &&
                matchups.every((matchup) => matchup.whoWin !== "");
              setRound1Complete(isRound1Complete);

              // If Round 1 is complete and Round 2 matchups haven't been generated, generate Round 2 matchups
              if (isRound1Complete && matchupsRound2.length === 0) {
                  setMatchupsRound2(tournamentData.matchsRound2);
              }

              const isRound2Complete =
                matchupsRound2 &&
                matchupsRound2.every((matchup) => matchup.whoWin !== "");
              setRound2Complete(isRound2Complete);

              // If Round 2 is complete and Round 3 matchups haven't been generated, generate Round 3 matchups
              if (isRound2Complete && matchupsRound3.length === 0) {
                  setMatchupsRound3(tournamentData.matchsRound3);
              }

              const isRound3Complete =
                matchupsRound3 &&
                matchupsRound3.every((matchup) => matchup.whoWin !== "");
              setRound3Complete(isRound3Complete);

              // If Round 3 is complete and Round 4 matchups haven't been generated, generate Round 4 matchups
              if (isRound3Complete && matchupsRound4.length === 0) {
                  setMatchupsRound4(tournamentData.matchsRound4);
              }
            } else {
              setTeams(tournamentData.teams);
              console.log("Tournament document does not contain matchs");
            }
          } else {
            console.log("Tournament document does not exist");
          }
        }
      );

     
    } else {
      console.log(
        "Tournament name is not available in the organizer document"
      );
    }
  
          }
      );

      return () => {
          // Unsubscribe from the organizer snapshot when the component unmounts
          unsubscribeOrganizer();
      };
  } catch (error) {
      console.error("Error fetching data:", error);
  }
};

  const generateMatchups = async () => {
    try {
        const tournamentOrganizerDoc = await getDoc(
            doc(db, "users", auth.currentUser.uid)
          );
          const emptymatchs=[]
          const tournamentRef = doc(
            db,
            "tournament",
            tournamentOrganizerDoc.data().tournament
          );
          const tournamentDoc=getDoc(tournamentRef)
      const Teams = (await tournamentDoc).data().matchs[0]

      

      setMatchups(Teams);

      console.log("Matchups updated in the tournament document");
    } catch (error) {
      console.error("Error generating matchups:", error);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleMatchButtonClick = (matchup, round) => {
    // Navigate to a new page with the selected matchup
    navigation.navigate("TournamentOrgRating", {
      team1: matchup.team1,
      team2: matchup.team2,
      matchIndex: matchup.matchIndex,
      whoWin: "",
      round: round,
    });
  };



  

  return (
    <View style={styles.container}>
      
        <Text style={styles.title}>Tournament Bracket</Text>
        {matchups.map((matchup, index) => (
          <View key={index} style={styles.matchupContainer}>
            <Text style={styles.matchupText}>
              {matchup.team1.name} vs {matchup.team2.name}
            </Text>
            <Button
              title="result"
              onPress={() => handleMatchButtonClick(matchup, 1)}
            />
            <Text> Winner is :{matchup.whoWin}</Text>
          </View>
        ))}

        <Text>Round 2</Text>
        {matchupsRound2.map((matchup, index) => (
          <View key={index} style={styles.matchupContainer}>
            <Text style={styles.matchupText}>
              {matchup.team1.name} vs {matchup.team2.name}
            </Text>
            <Button
              title="result"
              onPress={() => handleMatchButtonClick(matchup, 2)}
            />

            <Text> Winner is: {matchup.whoWin}</Text>
          </View>
        ))}

        <Text>Round 3</Text>
        {matchupsRound3.map((matchup, index) => (
          <View key={index} style={styles.matchupContainer}>
            <Text style={styles.matchupText}>
              {matchup.team1.name} vs {matchup.team2.name}
            </Text>
            <Button
              title="Result"
              onPress={() => handleMatchButtonClick(matchup, 3)}
            />

            <Text> Winner is: {matchup.whoWin}</Text>
          </View>
        ))}

        {matchupsRound4.map((matchup, index) => (
          <>
            <Text>Final</Text>
            <View key={index} style={styles.matchupContainer}>
              <Text style={styles.matchupText}>
                {matchup.team1.name} vs {matchup.team2.name}
              </Text>
              <Button
                title="Result"
                onPress={() => handleMatchButtonClick(matchup, 4)}
              />

              <Text> Winner is: {matchup.whoWin}</Text>
            </View>
          </>
        ))}
        <Button title="randomize round 1" onPress={() => generateMatchups()} />

        
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  matchupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  matchupText: {
    fontSize: 16,
    marginRight: 8,
  },
});
