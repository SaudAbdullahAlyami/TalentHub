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

  const [assist, setAssist] = useState("0");
const [clearances, setClearances] = useState("0");
const [crosses, setCrosses] = useState("0");
const [passes, setPasses] = useState("0");
const [saves, setSaves] = useState("0");
const [shotsOnTarget, setShotsOnTarget] = useState("0");
const [tackles, setTackles] = useState("0");

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


/* index means 
goals=0
rating=1
assist=2
clearnes=3
crosses=4
passes=5
saves=6
shot on target=7
tackels=8

*/
  const savePlayerData = async (playerUid, data,index) => {
    try {
      const userRef = doc(db, "users", playerUid);
      const playerDoc = await getDoc(userRef);
      if(index==0){
       
        if (playerDoc.exists()) {
          const playerGoal = parseFloat(playerDoc.data().goals); // Convert to number
    
          if (playerGoal === 0 ||playerGoal==="0") {
            await updateDoc(userRef, {
              goals: parseFloat(data),
            });
            console.log("New player goal added");
          } else {
            const newGoal = playerGoal + parseFloat(data);
    
            await updateDoc(userRef, {
              goals: newGoal,
            });
            console.log("Player goal updated");
          }
        } else {
          console.log("Player document does not exist");
        }
      }else if (index==1){
        const prevPlayerRate = parseFloat(playerDoc.data().rating);
        const playerRate = parseFloat(data);
        if (prevPlayerRate == 0 || prevPlayerRate=="0") {
          await updateDoc(doc(db, "users", playerUid), {
            rating: playerRate,
          });
          console.log("new Player was rated");
        } else {
          const averageRate = (playerRate + prevPlayerRate) / 2;
  
          await updateDoc(doc(db, "users", playerUid), {
            rating: averageRate,
          });
          console.log("Player was rated");
        }
      }else if(index==2){
        if (playerDoc.exists()) {
          const playerAssist = parseFloat(playerDoc.data().assist); // Convert to number
    
          if (playerAssist === 0 ||playerAssist==="0") {
            await updateDoc(userRef, {
              assist: parseFloat(assist),
            });
            console.log("New player assist added");
          } else {
            const newAssist = playerAssist + parseFloat(assist);
    
            await updateDoc(userRef, {
              assist: newAssist,
            });
            console.log("Player assist updated");
          }
        }
      }else if(index==3){
        if (playerDoc.exists()) {
          const playerClearances = parseFloat(playerDoc.data().clearances); // Convert to number
    
          if (playerClearances === 0 ||playerClearances==="0") {
            await updateDoc(userRef, {
              clearances: parseFloat(data),
            });
            console.log("New player Clearances added");
          } else {
            const newClearances = playerClearances + parseFloat(data);
    
            await updateDoc(userRef, {
              clearances: newClearances,
            });
            console.log("Player Clearances updated");
          }
        }
      }else if(index==4){
        if (playerDoc.exists()) {
          const playerCrosses = parseFloat(playerDoc.data().crosses); // Convert to number
    
          if (playerCrosses === 0 ||playerCrosses==="0") {
            await updateDoc(userRef, {
              crosses: parseFloat(data),
            });
            console.log("New player crosses added");
          } else {
            const newCrosses = playerCrosses + parseFloat(data);
    
            await updateDoc(userRef, {
              crosses: newCrosses,
            });
            console.log("Player crosses updated");
          }
        }
      }else if(index==5){
        const playerPasses= parseFloat(playerDoc.data().passes); // Convert to number
    
          if (playerPasses === 0 ||playerPasses==="0") {
            await updateDoc(userRef, {
              passes: parseFloat(data),
            });
            console.log("New player passes added");
          } else {
            const newPasses = playerPasses + parseFloat(data);
    
            await updateDoc(userRef, {
              passes: newPasses,
            });
            console.log("Player passes updated");
          }
      }else if(index==6){
        const playerSaves = parseFloat(playerDoc.data().saves); // Convert to number
    
          if (playerSaves === 0 ||playerSaves==="0") {
            await updateDoc(userRef, {
              saves: parseFloat(data),
            });
            console.log("New player saves added");
          } else {
            const newSaves = playerSaves + parseFloat(data);
    
            await updateDoc(userRef, {
              saves: newSaves,
            });
            console.log("Player saves updated");
          }
      }else if(index==7){
        const playerShotsOnTarget = parseFloat(playerDoc.data().shotsOnTarget); // Convert to number
    
          if (playerShotsOnTarget === 0 ||playerShotsOnTarget==="0") {
            await updateDoc(userRef, {
              shotsOnTarget: parseFloat(data),
            });
            console.log("New player shotsOnTarget added");
          } else {
            const newShotsOnTarget = playerShotsOnTarget + parseFloat(data);
    
            await updateDoc(userRef, {
              shotsOnTarget: newShotsOnTarget,
            });
            console.log("Player shotsOnTarget updated");
          }
      }else if(index==8){
        const playerTackles = parseFloat(playerDoc.data().tackles); // Convert to number
    
        if (playerTackles === 0 ||playerTackles==="0") {
          await updateDoc(userRef, {
            tackles: parseFloat(data),
          });
          console.log("New player tackles added");
        } else {
          const newTackles = playerTackles + parseFloat(data);
  
          await updateDoc(userRef, {
            tackles: newTackles,
          });
          console.log("Player tackles updated");
        }
      }
     else {
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
            onChangeText={(text) => {
              setGoal1(text);
            }}
          />
        
        </View>
        <View style={styles.inputContainer}>
          <Text>Rating:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setRating1(text);
            }}
          />
          
        </View>

        <View style={styles.inputContainer}>
          <Text> Assist:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setAssist(text);
            }}
          />
          
        </View>

        <View style={styles.inputContainer}>
          <Text> clearances:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setClearances(text);
            }}
          />
          
        </View>


        <View style={styles.inputContainer}>
          <Text> crosses:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setCrosses(text);
            }}
          />
          
        </View>

        <View style={styles.inputContainer}>
          <Text> passes:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setPasses(text);
            }}
          />
          
        </View>

        <View style={styles.inputContainer}>
          <Text> saves:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setSaves(text);
            }}
          />
          
        </View>

        <View style={styles.inputContainer}>
          <Text> shotsOnTarget:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setShotsOnTarget(text);
            }}
          />
          
        </View>

        <View style={styles.inputContainer}>
          <Text> tackles:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setTackles(text);
            }}
          />
            
        </View>
        <Button
            title="Save Player data"
            onPress={() => {
              savePlayerData(item.uid, goal1,0)
              savePlayerData(item.uid, rating1,1)
              savePlayerData(item.uid, assist,2)
              savePlayerData(item.uid, clearances,3)
              savePlayerData(item.uid, crosses,4)
              savePlayerData(item.uid, passes,5)
              savePlayerData(item.uid, saves,6)
              savePlayerData(item.uid, shotsOnTarget,7)
              savePlayerData(item.uid, tackles,8)
            }}
          />


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
              value={goal1}
              onChangeText={(text) => {
                setGoal1(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, goal1,0)}
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
              onPress={() => savePlayerData(item.uid, rating1,1)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text> Assist:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setAssist(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, assist,2)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text> clearances:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setClearances(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, clearances,3)}
            />
          </View>
  
  
          <View style={styles.inputContainer}>
            <Text> crosses:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setCrosses(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, crosses,4)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text> passes:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setPasses(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, passes,5)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text> saves:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setSaves(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, saves,6)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text> shotsOnTarget:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setShotsOnTarget(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, shotsOnTarget,7)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text> tackles:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setTackles(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => savePlayerData(item.uid, tackles,8)}
            />
          </View>
  
  
  
        </View>
      )
            }
            
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
