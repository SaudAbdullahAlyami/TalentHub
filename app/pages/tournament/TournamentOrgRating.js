import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { db, auth, firebase } from "../../component/config/config";

export const TournamentOrgRating = ({ route, navigation }) => {
  const { team1, team2, matchIndex,whoWin,round } = route.params;
  var WhoWin=""
  const [team1Goals, setTeam1Goals] = useState("0");
  const [team2Goals, setTeam2Goals] = useState("0");
  const [player1Ratings, setPlayer1Ratings] = useState(team1.players);
  const [player2Ratings, setPlayer2Ratings] = useState(team2.players);
  const [goal1, setGoal1] = useState("0");
  const [rating1, setRating1] = useState("0");
  const [goal2, setGoal2] = useState("0");
  const [rating2, setRating2] = useState("0");

  const handleSave = async () => {
    try {
      if (parseFloat(team1Goals) > parseFloat(team2Goals)) {
        WhoWin = team1.name;
      } else if (parseFloat(team1Goals) < parseFloat(team2Goals)) {
        WhoWin = team2.name;
      }

      const tournamentOrganizerRef = doc(db, "users", auth.currentUser.uid);

      const unsubscribeOrganizer = onSnapshot(
        tournamentOrganizerRef,
        async (orgDoc) => {
          if (orgDoc.exists()) {
            const tournamentName = orgDoc.data().tournament;

            const tournamentRef = doc(db, "tournament", tournamentName);

            // Fetch the current state of the tournament
            const tournamentDoc = await getDoc(tournamentRef);
            const tournamentData = tournamentDoc.data();

            // Assuming matchIndex is the index of the match you want to update
            if(round==1){
            const updatedMatchs = [...tournamentData.matchs];

            // Update the WhoWin property for the specified matchIndex
            updatedMatchs[matchIndex].whoWin = WhoWin;
            updatedMatchs[matchIndex].team1Goals = team1Goals;
            updatedMatchs[matchIndex].team2Goals = team2Goals;

            // Update the tournament document with the modified matchs array
            await updateDoc(tournamentRef, { matchs: updatedMatchs });
          }else if (round==2){
            const updatedMatchs = [...tournamentData.matchsRound2];

            // Update the WhoWin property for the specified matchIndex
            updatedMatchs[matchIndex].whoWin = WhoWin;
            updatedMatchs[matchIndex].team1Goals = team1Goals;
            updatedMatchs[matchIndex].team2Goals = team2Goals;
            // Update the tournament document with the modified matchs array
            await updateDoc(tournamentRef, { matchsRound2: updatedMatchs });
          }

        else if (round==3){
          const updatedMatchs = [...tournamentData.matchsRound3];

          // Update the WhoWin property for the specified matchIndex
          updatedMatchs[matchIndex].whoWin = WhoWin;
          updatedMatchs[matchIndex].team1Goals = team1Goals;
          updatedMatchs[matchIndex].team2Goals = team2Goals;
          // Update the tournament document with the modified matchs array
          await updateDoc(tournamentRef, { matchsRound3: updatedMatchs });
        }
        else if (round==4){
          const updatedMatchs = [...tournamentData.matchsRound4];

          // Update the WhoWin property for the specified matchIndex
          updatedMatchs[matchIndex].whoWin = WhoWin;
          updatedMatchs[matchIndex].team1Goals = team1Goals;
          updatedMatchs[matchIndex].team2Goals = team2Goals;
          // Update the tournament document with the modified matchs array
          await updateDoc(tournamentRef, { matchsRound4: updatedMatchs });
        }
          }
        }
      );
    } catch (error) {
      console.error(error);
    }

    console.log("The Winner is:", WhoWin);

    // Navigate back to the previous screen
    navigation.goBack();
  };

  const savePlayerRating = async (playerUid, rate) => {
    try {
      const playerDoc = await getDoc(doc(db, "users", playerUid));
      const prevPlayerRate = parseFloat(playerDoc.data().rate);
      const playerRate = parseFloat(rate);
      if (prevPlayerRate == 0 || prevPlayerRate=="0") {
        await updateDoc(doc(db, "users", playerUid), {
          rate: playerRate,
        });
        console.log("new Player was rated");
      } else {
        const averageRate = (playerRate + prevPlayerRate) / 2;

        await updateDoc(doc(db, "users", playerUid), {
          rate: averageRate,
        });
        console.log("Player was rated");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const savePlayerGoal = async (playerUid, goal) => {
    try {
      const userRef = doc(db, "users", playerUid);
      const playerDoc = await getDoc(userRef);
      
      if (playerDoc.exists()) {
        const playerGoal = parseFloat(playerDoc.data().goal); // Convert to number
  
        if (playerGoal === 0 ||playerGoal==="0") {
          await updateDoc(userRef, {
            goal: parseFloat(goal),
          });
          console.log("New player goal added");
        } else {
          const newGoal = playerGoal + parseFloat(goal);
  
          await updateDoc(userRef, {
            goal: newGoal,
          });
          console.log("Player goal updated");
        }
      } else {
        console.log("Player document does not exist");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

 
  const renderPlayer1Item = ({ item }) => {
    if(item !=null){
    return (
      <View style={styles.playerContainer}>
        <Text>{item.fullName}</Text>
        <View style={styles.inputContainer}>
          <Text> goals</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={goal1}
            onChangeText={(text) => {
              setGoal1(text);
            }}
          />
          <Button
            title="Save"
            onPress={() => savePlayerGoal(item.uid, goal1)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Rating:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rating1}
            onChangeText={(text) => {
              setRating1(text);
            }}
          />
          <Button
            title="Save"
            onPress={() => savePlayerRating(item.uid, rating1)}
          />
        </View>
      </View>
    )
          }
          
  };


  const renderPlayer2Item = ({ item }) => {
    if(item !=null){
    return (
      <View style={styles.playerContainer}>
        <Text>{item.fullName}</Text>
        <View style={styles.inputContainer}>
          <Text> goals</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            
            onChangeText={(text) => {
              setGoal2(text);
            }}
          />
          <Button
            title="Save"
            onPress={() => savePlayerGoal(item.uid, goal2)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Rating:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            
            onChangeText={(text) => {
              setRating2(text);
            }}
          />
          <Button
            title="Save"
            onPress={() => savePlayerRating(item.uid, rating2)}
          />
        </View>
      </View>
    );}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${team1.name} vs ${team2.name}`}</Text>
      <View style={styles.inputContainer}>
        <Text>Goals for {team1.name}:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={team1Goals}
          onChangeText={(text) => setTeam1Goals(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Goals for {team2.name}:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={team2Goals}
          onChangeText={(text) => setTeam2Goals(text)}
        />
      </View>
      <Text>{team1.name}</Text>
      <FlatList
        data={player1Ratings}
        renderItem={({ item }) => renderPlayer1Item({ item })}
      />
      <Text>{team2.name}</Text>
      <FlatList
        data={player2Ratings}
        renderItem={({ item }) => renderPlayer2Item({ item })}
      />
      <Button title="Save" onPress={handleSave} />
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
  playerContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    borderWidth: 2,
    padding: 13,
    width: 90,
  },
});
