import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../component/config/config";

export const TournamentOrgRating = ({ navigation }) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchData();

    // Clean up the subscription when the component unmounts
    return () => {
      // Add any cleanup code here
    };
  }, []);

  const fetchData = async () => {
    const tournamentOrganizer = doc(db, "users", auth.currentUser.uid);
    const tournamentOrganizerUnsubscribe = onSnapshot(
      tournamentOrganizer,
      async (orgDoc) => {
        if (orgDoc.exists()) {
          const tournamentName = orgDoc.data().tournamentName;

          const tournamentDoc = doc(db, "tournament", tournamentName);
          const tournamentUnsubscribe = onSnapshot(
            tournamentDoc,
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const tournamentData = docSnapshot.data();
                if (tournamentData.teams) {
                  setTeams(tournamentData.teams);
                  console.log("Teams updated in real-time");
                }
              } else {
                console.log("Tournament document does not exist");
              }
            }
          );
        } else {
          console.log("Tournament organizer document does not exist");
        }
      }
    );
  };

  const handleRatingChange = (teamIndex, playerIndex, newRating) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].players[playerIndex].rating = newRating;
    setTeams(updatedTeams);
  };

  const saveRatingsToDatabase = async () => {
  try {
    // Iterate through teams and players to save ratings
    for (const team of teams) {
      for (const player of team.players) {
        // Assuming each player has a unique identifier (e.g., player.id) in your database
        const playerDocRef = doc(db, "players", player.id);

        // Update the player's rating in the database
        await setDoc(playerDocRef, { rating: player.rating }, { merge: true });
        console.log(`Rating for Player ${player.id} saved to the database: ${player.rating}`);
      }
    }

    console.log("All ratings saved to the database");
  } catch (error) {
    console.error("Error saving ratings to the database", error);
  }
};

  const render = ({ item: team, index: teamIndex }) => {
    return (
      <View style={styles.teamContainer}>
        <Text style={styles.teamName}>{team.name}</Text>
        {team.players.length > 0 && (
          <View>
            <Text style={styles.playersCount}>Players:</Text>
            {team.players.map((player, playerIndex) => (
              <View key={playerIndex}>
                <Text style={styles.playerAge}>
                  Player {playerIndex + 1} Age: {player.age}
                </Text>
                <TextInput
                  style={styles.ratingInput}
                  placeholder="Enter rating"
                  keyboardType="numeric"
                  onChangeText={(newRating) =>
                    handleRatingChange(teamIndex, playerIndex, newRating)
                  }
                />
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teams List</Text>
      <FlatList data={teams} keyExtractor={(item) => item.name} renderItem={render} />
      
            <TouchableOpacity style={styles.saveButton} onPress={saveRatingsToDatabase}>
        <Text style={styles.saveButtonText}>Save Ratings</Text>
      </TouchableOpacity>
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
  playerAge: {
    marginBottom: 5,
  },
  ratingInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  saveButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});