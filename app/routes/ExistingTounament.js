import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
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
    async function getData() {
      const tournamentOrganizerRef = doc(db, "users", auth.currentUser.uid);
      const organizerDoc = await getDoc(tournamentOrganizerRef);
      if (organizerDoc.exists()) {
        const tournamentName = organizerDoc.data().tournament;

        if (tournamentName) {
          setTournamentId(tournamentName);
          const tournamentRef = doc(db, "tournament", tournamentName);
          const unsubscribeSnapshot = onSnapshot(
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
                   
                    matchups.every((matchup) => matchup.whoWin !== "");
                  setRound1Complete(isRound1Complete);
                  console.log("Round 1 complete? :"+isRound1Complete)
                  // If Round 1 is complete and Round 2 matchups haven't been generated, generate Round 2 matchups
                  if (isRound1Complete && matchupsRound2.length === 0) {
                    generateMatchupsRound2(tournamentData.matchsRound2);
                  }

                  const isRound2Complete =
                    
                    matchupsRound2.every((matchupsRound2) => matchupsRound2.whoWin !== "");
                  setRound2Complete(isRound2Complete);
                  console.log("Round 2 complete? :"+isRound2Complete)
                  // If Round 2 is complete and Round 3 matchups haven't been generated, generate Round 3 matchups
                  if (isRound2Complete && matchupsRound3.length === 0) {
                    generateMatchupsRound3(tournamentData.matchsRound3);
                  }

                  const isRound3Complete =
                   
                    matchupsRound3.every((matchupsRound3) => matchupsRound3.whoWin !== "");
                  setRound3Complete(isRound3Complete);
                  console.log("Round 3 complete? :"+isRound3Complete)
                  // If Round 3 is complete and Round 4 matchups haven't been generated, generate Round 4 matchups
                  if (isRound3Complete && matchupsRound4.length === 0) {
                    generateMatchupsRound4(tournamentData.matchsRound4);
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

          return () => unsubscribeSnapshot();
        } else {
          console.log(
            "Tournament name is not available in the organizer document"
          );
        }
      } else {
        console.log("Tournament organizer document does not exist");
      }
    }

    getData();
  }, []);

  const generateMatchups = async () => {
    try {
      //this means the 16 teams are regestired and now ready to random
      if (teams.find((team) => team.name != "Team 16")) {
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
          });
          matchIndex++;
        }

        setMatchups(generatedMatchups);

        const tournamentOrganizerDoc = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const emptymatchs = [];
        const tournamentRef = doc(
          db,
          "tournament",
          tournamentOrganizerDoc.data().tournament
        );

        await updateDoc(tournamentRef, {
          matchs: generatedMatchups,
          matchsRound2: emptymatchs,
          matchsRound3: emptymatchs,
          matchsRound4: emptymatchs,
        });

        console.log("Matchups updated in the tournament document");
      } else {
        console.error("the teams are not 16");
      }
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

        const tournamentOrganizerDoc = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const tournamentRef = doc(
          db,
          "tournament",
          tournamentOrganizerDoc.data().tournament
        );

        await updateDoc(tournamentRef, {
          matchsRound2: round2Matchups,
        });
      } else {
        const tournamentOrganizerDoc = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const tournamentDoc = getDoc(
          doc(db, "tournament", tournamentOrganizerDoc.data().tournament)
        );
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

        const tournamentOrganizerDoc = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const tournamentRef = doc(
          db,
          "tournament",
          tournamentOrganizerDoc.data().tournament
        );

        await updateDoc(tournamentRef, {
          matchsRound3: round3Matchups,
        });
        console.log("Round 3 matchups generated:" + round3Matchups);
      } else {
        const tournamentOrganizerDoc = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const tournamentDoc = getDoc(
          doc(db, "tournament", tournamentOrganizerDoc.data().tournament)
        );
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

        const tournamentOrganizerDoc = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const tournamentRef = doc(
          db,
          "tournament",
          tournamentOrganizerDoc.data().tournament
        );

        await updateDoc(tournamentRef, {
          matchsRound4: round4Matchups,
        });
        console.log("Round 4 matchups generated:" + round4Matchups);
      } else {
        const tournamentOrganizerDoc = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const tournamentDoc = getDoc(
          doc(db, "tournament", tournamentOrganizerDoc.data().tournament)
        );
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
      const OrgDoc = getDoc(doc(db, "users", auth.currentUser.uid));
      const tournamentName = (await OrgDoc).data().tournament;

      //deleting the tournament in coachs
      getDocs(collection(db, "users")).then((docSnap) => {
        docSnap.forEach(async (docc) => {
          const dataa = docc.data();
          if (dataa.role == "Coach") {
            if (dataa.tournament == tournamentName) {
              console.log("ii");
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

      deleteDoc(doc(db, "tournament", tournamentName));

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        tournament: "",
      });
      navigation.navigate("CreateTournament");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
    marginBottom: 16,
  },
  matchupText: {
    fontSize: 16,
    marginRight: 8,
  },
});
