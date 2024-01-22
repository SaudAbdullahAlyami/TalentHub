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
  const { team1, team2, matchIndex, whoWin, round } = route.params;
  var WhoWin = ""
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

  // Here mjood
  const [playerData, setPlayerData] = useState({});


  const updatePlayerData = (playerUid, attribute, value) => {
    setPlayerData((prevData) => ({
      ...prevData,
      [playerUid]: {
        ...prevData[playerUid],
        [attribute]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      Object.keys(playerData).forEach(async (playerUid) => {
        const data = playerData[playerUid];

        await savePlayerData(playerUid, data);
      });
    } catch (error) {
      console.error(error);
    }

    console.log("Player data saved:", playerData);

    // Reset playerData state after saving
    setPlayerData({});
    navigation.goBack();
  };



  const savePlayerRating = async (playerUid, rate) => {
    try {
      const playerDoc = await getDoc(doc(db, "users", playerUid));
      const prevPlayerRate = parseFloat(playerDoc.data().rating);
      const playerRate = parseFloat(rate);
      if (prevPlayerRate == 0 || prevPlayerRate == "0") {
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
    } catch (error) {
      console.error(error);
    }
  };


  const savePlayerData = async (playerUid, data) => {
    try {
      const userRef = doc(db, "users", playerUid);
      const playerDoc = await getDoc(userRef);

      if (playerDoc.exists()) {
        Object.keys(data).forEach(async (attribute) => {
          const value = data[attribute];
          const playerAttribute = parseFloat(playerDoc.data()[attribute]);

          if (playerAttribute === 0 || playerAttribute === "0") {
            await updateDoc(userRef, {
              [attribute]: parseFloat(value),
            });
            console.log(`New player ${attribute} added`);
          } else {
            const newAttribute = playerAttribute + parseFloat(value);

            await updateDoc(userRef, {
              [attribute]: newAttribute,
            });
            console.log(`Player ${attribute} updated`);
          }
        });
      } else {
        console.log("Player document does not exist");
      }
    } catch (error) {
      console.error(error);
    }
  };




  const renderPlayerItem = ({ item }) => {
    if (item != null) {
      return (
        <View style={styles.playerContainer}>
          <Text>{item.fullName}</Text>
          <View style={styles.inputContainer}>
            <Text> goals</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={playerData[item.uid]?.goals || ""}
              onChangeText={(text) => updatePlayerData(item.uid, "goals", text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Rating:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={playerData[item.uid]?.rating || ""}
              onChangeText={(text) => updatePlayerData(item.uid, "rating", text)}
            />
          </View>

          {/* Add other attributes here similarly */}
        </View>
      );
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
      <FlatList data={player1Ratings} renderItem={renderPlayerItem} />
      <FlatList data={player2Ratings} renderItem={renderPlayerItem} />
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
