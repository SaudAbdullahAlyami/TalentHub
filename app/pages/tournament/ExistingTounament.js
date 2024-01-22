import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../component/config/config";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from 'react-native-paper';

export const ExistingTournament = ({ navigation }) => {
  const [tournamentId, setTournamentId] = useState("");
  const [teams, setTeams] = useState([]);
  const [matchups, setMatchups] = useState([]); //8 matchs
  const [matchupsRound2, setMatchupsRound2] = useState([]); //4 matchs
  const [matchupsRound3, setMatchupsRound3] = useState([]); //2 matchs
  const [matchupsRound4, setMatchupsRound4] = useState([]); //2 matchs
  const [round1Complete, setRound1Complete] = useState(false); //to know if round 1 finish
  const [round2Complete, setRound2Complete] = useState(false); //to know if round 2 finish
  const [round3Complete, setRound3Complete] = useState(false); //to know if round 3 finish

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const tournamentOrganizerRef = doc(db, "users", auth.currentUser.uid);
    const organizerDoc = await getDoc(tournamentOrganizerRef);
    if (organizerDoc.exists()) {
      const tournamentName = organizerDoc.data().tournament;
      setTournamentId(tournamentName);
      const tournamentRef = doc(db, "tournament", tournamentName);
      const tournamentDoc = await getDoc(tournamentRef);
      if (tournamentName) {
        if (tournamentDoc.exists()) {
          const tournamentData = tournamentDoc.data();
          const tournamentMatchs = tournamentData.matchs;
          if (tournamentData && tournamentMatchs.length !== 0) {
            setTeams(tournamentData.teams);
            console.log("Updated team from the database");
            setMatchups(tournamentData.matchs);
            console.log("Matchups update in real-time");

            const isRound1Complete =
              matchups && matchups.every((matchup) => matchup.whoWin !== "");
            setRound1Complete(isRound1Complete);
            console.log("Round1 complete? :" + isRound1Complete);
            // If Round 1 is omplete and Round 2 matchups haven't been generated, generate Round 2 matchups
            if (tournamentDoc.data().matchsRound2.length != 0) {
              fetchRound2();
            }
            if (tournamentDoc.data().matchsRound3.length != 0) {
              fetchRound3();
            }

            if (tournamentDoc.data().matchsRound4.length != 0) {
              fetchRound4();
            }
          } else {
            setTeams(tournamentData.teams);
            console.log("Tournament document does not contain matchs");
          }
        } else {
          console.log("Tournament document does not exist");
        }
      } else {
        console.log(
          "Tournament name is not available in the organizer document"
        );
      }
    } else {
      console.log("Tournament organizer document does not exist");
    }
  }

  const generateMatchups = async () => {
    try {
      //this means the 16 teams are regestired and now ready to random

      const shuffledTeams = shuffleArray([...teams]);

      const generatedMatchups = [];
      var matchIndex = 0;
      for (let i = 0; i < shuffledTeams.length; i += 2) {
        const team1 = shuffledTeams[i];
        const team2 = shuffledTeams[i + 1];
        generatedMatchups.push({
          team1,
          team2,
          matchIndex: matchIndex,
          whoWin: "",
          team1Goals:'0',
          team2Goals:'0'
        });
        matchIndex++;
      }

      setMatchups(generatedMatchups);

      const tournamentRef = doc(db, "tournament", tournamentId);

      await updateDoc(tournamentRef, {
        matchs: generatedMatchups,
      });

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

  const generateMatchupsRound2 = async (existingMatchupsRound2) => {
    try {
      if (existingMatchupsRound2.length == 0) {
        const round2Matchups = [];
        const winners = matchups.map((matchup) => matchup.whoWin);
        var matchIndex = 0;
        for (let i = 0; i < winners.length; i += 2) {
          const team1 = teams.find((team) => team.name === winners[i]);
          const team2 = teams.find((team) => team.name === winners[i + 1]);
          round2Matchups.push({
            team1,
            team2,
            matchIndex: matchIndex,
            whoWin: "",
          });
          matchIndex++;
        }

        setMatchupsRound2(round2Matchups);
        console.log("Round 2 matchups generated:");

        const tournamentRef = doc(db, "tournament", tournamentId);

        await updateDoc(tournamentRef, {
          matchsRound2: round2Matchups,
        });
      } else {
        const tournamentDoc = getDoc(doc(db, "tournament", tournamentId));
        const round2Matchups = (await tournamentDoc).data().matchsRound2;
        setMatchupsRound2(round2Matchups);
        console.log("Round 2 matchups Recovered from DB:");
      }
    } catch (error) {
      console.error("Error generting Round 2 matchups:", error);
    }
  };

  const generateMatchupsRound3 = async (existingMatchupsRound3) => {
    try {
      if (existingMatchupsRound3.length === 0) {
        const round3Matchups = [];
        const winners = matchupsRound2.map((matchup) => matchup.whoWin);
        var matchIndex = 0;
        for (let i = 0; i < winners.length; i += 2) {
          const team1 = teams.find((team) => team.name === winners[i]);
          const team2 = teams.find((team) => team.name === winners[i + 1]);
          round3Matchups.push({
            team1,
            team2,
            matchIndex: matchIndex,
            whoWin: "",
          });
          matchIndex++;
        }

        setMatchupsRound3(round3Matchups);

        const tournamentRef = doc(db, "tournament", tournamentId);

        await updateDoc(tournamentRef, {
          matchsRound3: round3Matchups,
        });
        console.log("Round 3 matchups generated:" + round3Matchups);
      } else {
        const tournamentDoc = getDoc(doc(db, "tournament", tournamentId));
        const round3Matchups = (await tournamentDoc).data().matchsRound3;
        setMatchupsRound3(round3Matchups);
        console.log("Round 3 matchups Recovered from DB:");
      }
    } catch (error) {
      console.error("Error generting Round 3 matchups:", error);
    }
  };

  const generateMatchupsRound4 = async (existingMatchupsRound4) => {
    try {
      if (existingMatchupsRound4.length === 0) {
        const round4Matchups = [];
        const winners = matchupsRound3.map((matchup) => matchup.whoWin);
        var matchIndex = 0;
        for (let i = 0; i < winners.length; i += 2) {
          const team1 = teams.find((team) => team.name === winners[i]);
          const team2 = teams.find((team) => team.name === winners[i + 1]);
          round4Matchups.push({
            team1,
            team2,
            matchIndex: matchIndex,
            whoWin: "",
          });
          matchIndex++;
        }

        setMatchupsRound4(round4Matchups);

        const tournamentRef = doc(db, "tournament", tournamentId);

        await updateDoc(tournamentRef, {
          matchsRound4: round4Matchups,
        });
        console.log("Round 4 matchups generated:" + round4Matchups);
      } else {
        const tournamentDoc = getDoc(doc(db, "tournament", tournamentId));
        const round4Matchups = (await tournamentDoc).data().matchsRound4;
        setMatchupsRound4(round4Matchups);
        console.log("Round 4 matchups Recovered from DB:");
      }
    } catch (error) {
      console.error("Error generting Round 4 matchups:", error);
    }
  };

  const DeleteTournament = async () => {
    try {
      //deleting the tournament in coachs
      getDocs(collection(db, "users")).then((docSnap) => {
        docSnap.forEach(async (docc) => {
          const dataa = docc.data();
          if (dataa.role == "Coach") {
            if (dataa.tournament == tournamentId) {
              //deleting the tournament in coachs
              await updateDoc(doc(db, "users", docc.data().uid), {
                tournament: "",
              });
              //deleting the tournament in clubs
              const clubName = docc.data().clubName;
              const clubRef = doc(db, "clubs", clubName);

              await updateDoc(clubRef, {
                tournament: "",
              });
            }
          }
        });
      });

      deleteDoc(doc(db, "tournament", tournamentId));

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        tournament: "",
      });
      navigation.navigate("CreateTournament");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRound2 = async () => {
    try {
      const tournamentRef = doc(db, "tournament", tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
      if (round1Complete) {
        console.log("Joined Round 2");
        generateMatchupsRound2(tournamentDoc.data().matchsRound2);
        const isRound2Complete = matchupsRound2.every(
          (matchupsRound2) => matchupsRound2.whoWin !== ""
        );
        setRound2Complete(isRound2Complete);
        console.log("Round2 complete? :" + isRound2Complete);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRound3 = async () => {
    try {
      const tournamentRef = doc(db, "tournament", tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
      if (round2Complete) {
        console.log("Joined Round 3");
        generateMatchupsRound3(tournamentDoc.data().matchsRound3);
        const isRound3Complete = matchupsRound2.every(
          (matchupsRound3) => matchupsRound3.whoWin !== ""
        );
        setRound3Complete(isRound3Complete);
        console.log("Round3 complete? :" + isRound3Complete);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRound4 = async () => {
    try {
      const tournamentRef = doc(db, "tournament", tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
      console.log("Joined Round 4");
      generateMatchupsRound4(tournamentDoc.data().matchsRound4);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Tournament Bracket</Text>
        <TouchableOpacity onPress={() => getData()}>
          <Text>Refresh</Text>
        </TouchableOpacity>

        {matchups.length == 0 && (
          <Button
            title="randomize round 1"
            onPress={() => generateMatchups()}
          />
        )}

        {matchups.map((matchup, index) => (
          <View style={{marginBottom:20,}}>
          <View key={index} style={styles.matchupContainer}>
          <Avatar.Image backgroundColor="grey"
            size={45} 
              source={({uri : matchup.team1.teamImage})}
              
            />
            <Text style={styles.matchupText}>
              {matchup.team1.name} vs
              <Avatar.Image backgroundColor="grey"
            size={45} 
              source={({uri : matchup.team2.teamImage})}
              
            /> {matchup.team2.name}
            </Text>
            <Button
              title="result"
              onPress={() => handleMatchButtonClick(matchup, 1)}
            />
            <Text> Winner is :{matchup.whoWin}</Text>
            
          </View>
          <Text>  {matchup.team1.name} goal:{matchup.team1Goals}</Text>
          <Text>  {matchup.team2.name} goal:{matchup.team2Goals}</Text>
          </View>
        ))}

        {round1Complete && matchupsRound2.length==0 &&(
          <Button
            title="Start Round2"
            onPress={() => fetchRound2()}
            style={{ backgroundColor: "green" }}
          />
        )}

        <Text>Round2</Text>
        {matchupsRound2.map((matchup, index) => (
          <View key={index} style={styles.matchupContainer}>
            
            <Text style={styles.matchupText}>
              {matchup.team1.name} vs {matchup.team2.name}
            </Text>


          

            <Button
              title="result"
              onPress={() => handleMatchButtonClick(matchup, 2)}
            />

            <Text> Winner is {matchup.whoWin}</Text>
          </View>
        ))}

        {round2Complete &&matchupsRound3.length==0 && (
          <Button
            title="Start Round3"
            onPress={() => fetchRound3()}
            style={{ backgroundColor: "green" }}
          />
        )}
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
        {round3Complete &&matchupsRound4.length==0 && (
          <Button
            title="Start Round4"
            onPress={() => fetchRound4()}
            style={{ backgroundColor: "green" }}
          />
        )}
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

        <Button
          title="Start new Tournament"
          onPress={() => DeleteTournament()}
          color={"red"}
        />
      </ScrollView>
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
    
  },
  matchupText: {
    fontSize: 16,
    marginRight: 8,
  },
});
