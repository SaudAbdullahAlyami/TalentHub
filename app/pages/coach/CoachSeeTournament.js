import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,ScrollView
} from "react-native";
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
import { Avatar } from "react-native-paper";

export const CoachSeeTournament = ({ navigation }) => {
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
            setMatchupsRound2(tournamentData.matchsRound2);
            setMatchupsRound3(tournamentData.matchsRound3);
            setMatchupsRound4(tournamentData.matchsRound4);
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View className="flex-row justify-center">
          <Image
            source={require("../../assets/tour2.png")}
            style={{ width: 300, height: 300 }}
          />
        </View>
        <Text className="self-center bottom-5 " style={styles.title}>
          Tournament Bracket
        </Text>

        <View
          className="flex-1 bg-white  px-8 pt-3  rounded-tr-3xl rounded-tl-2xl  self-center"
          style={{ width: 400 }}
        >
          <TouchableOpacity style={styles.refresh} onPress={() => getData()}>
            <Image
              source={require("../../assets/refresh.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>

          <Text
            className="self-center bottom-9  rounded-3xl "
            style={styles.roundtitle}
          >
            Round of 16
          </Text>
          {matchups.map((matchup, ) => (
            <View style={styles.hi}>
              <View  style={styles.matchupContainer}>
                <Avatar.Image
                  style={styles.photo1}
                  backgroundColor="grey"
                  size={40}
                  source={{ uri: matchup.team1.teamImage }}
                />
                <Avatar.Image
                  style={styles.photo2}
                  backgroundColor="pink"
                  className="left-52"
                  size={40}
                  source={{ uri: matchup.team2.teamImage }}
                />

                <View className="w-20 items-end">
                  <Text style={styles.matchupText}>{matchup.team1.name}</Text>
                </View>

                <View className="w-20 items-start">
                  <Text style={styles.matchupText2}>{matchup.team2.name}</Text>
                </View>

                {/* <Text> Winner is :{matchup.whoWin}</Text>  */}
              </View>

              <View
                className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l"
                style={{ backgroundColor: "#00B365" }}
              >
                <Text className="top-1 font-bold " style={styles.matchupscore}>
                  {" "}
                  {matchup.team1Goals} - {matchup.team2Goals}{" "}
                </Text>
              </View>
            </View>
          ))}

          <Text
            className="self-center bottom-5 items-center  rounded-3xl"
            style={styles.roundtitle}
          >
            Quarter-finals
          </Text>

          {matchupsRound2.map((matchup, ) => (
            <View style={styles.hi}>
              <View  style={styles.matchupContainer}>
                <Avatar.Image
                  style={styles.photo1}
                  backgroundColor="grey"
                  size={40}
                  source={{ uri: matchup.team1.teamImage }}
                />
                <Avatar.Image
                  style={styles.photo2}
                  backgroundColor="pink"
                  className="left-52"
                  size={40}
                  source={{ uri: matchup.team2.teamImage }}
                />

                <View className="w-20 items-end">
                  <Text style={styles.matchupText}>{matchup.team1.name}</Text>
                </View>

                <View className="w-20 items-start">
                  <Text style={styles.matchupText2}>{matchup.team2.name}</Text>
                </View>
              </View>

              <View
                className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l"
                style={{ backgroundColor: "#00B365" }}
              >
                <Text className="top-1 font-bold " style={styles.matchupscore}>
                  {" "}
                  {matchup.team1Goals} - {matchup.team2Goals}{" "}
                </Text>
              </View>
            </View>
          ))}
          <Text
            className="self-center bottom-5 rounded-3xl"
            style={styles.roundtitle}
          >
            Semi-finals
          </Text>

          {matchupsRound3.map((matchup, ) => (
            <View style={styles.hi}>
              <View  style={styles.matchupContainer}>
                <Avatar.Image
                  style={styles.photo1}
                  backgroundColor="grey"
                  size={40}
                  source={{ uri: matchup.team1.teamImage }}
                />
                <Avatar.Image
                  style={styles.photo2}
                  backgroundColor="pink"
                  className="left-52"
                  size={40}
                  source={{ uri: matchup.team2.teamImage }}
                />

                <View className="w-20 items-end">
                  <Text style={styles.matchupText}>{matchup.team1.name}</Text>
                </View>

                <View className="w-20 items-start">
                  <Text style={styles.matchupText2}>{matchup.team2.name}</Text>
                </View>
              </View>

              <View
                className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l"
                style={{ backgroundColor: "#00B365" }}
              >
                <Text className="top-1 font-bold " style={styles.matchupscore}>
                  {" "}
                  {matchup.team1Goals} - {matchup.team2Goals}{" "}
                </Text>
              </View>
            </View>
          ))}

          <Text
            className="self-center bottom-5   rounded-3xl"
            style={styles.roundtitle}
          >
            Final
          </Text>

          {matchupsRound4.map((matchup, ) => (
            <>
              

              <View style={styles.hif}>
                <View  style={styles.matchupContainer}>
                  <Avatar.Image
                    style={styles.photo1}
                    backgroundColor="grey"
                    size={40}
                    source={{ uri: matchup.team1.teamImage }}
                  />
                  <Avatar.Image
                    style={styles.photo2}
                    backgroundColor="pink"
                    className="left-52"
                    size={40}
                    source={{ uri: matchup.team2.teamImage }}
                  />

                  <View className="w-20 items-end">
                    <Text style={styles.matchupText}>{matchup.team1.name}</Text>
                  </View>

                  <View className="w-20 items-start">
                    <Text style={styles.matchupText2}>
                      {matchup.team2.name}
                    </Text>
                  </View>
                </View>

                <View
                  className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l"
                  style={{ backgroundColor: "#00B365" }}
                >
                  <Text
                    className="top-1 font-bold "
                    style={styles.matchupscore}
                  >
                    {" "}
                    {matchup.team1Goals} - {matchup.team2Goals}{" "}
                  </Text>
                </View>

                <View className="items-center" style={styles.bgchamp}>
                  <Image
                    source={require("../../assets/trophy.png")}
                    style={{ width: 300, height: 200 }}
                  />

                  <Text className="top-3" style={styles.champtitle}>
                    Tournament Champion
                  </Text>

                  <Text className="top-3" style={styles.winner}>
                    {matchup.whoWin}
                  </Text>

                  <View className="bg-white pt-7 "></View>
                </View>
              </View>
            </>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00B365",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  matchupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  matchupText: {
    fontSize: 12,

    fontWeight: "bold",
    color: "#00B365",
  },
  matchupText2: {
    fontSize: 12,

    fontWeight: "bold",
    color: "#00B365",
  },
  hi: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 50,
    marginBottom: 23,
  },
  hif: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 50,
    marginBottom: 320,
  },
  button1: {
    position: "absolute",
    top: 300, // Adjust the top position as needed
    right: 10, // Adjust the right position as needed

    padding: 10,
    borderRadius: 5,
  },
  photo1: {
    position: "absolute",
    left: 88,
    // Adjust the right position as needed
  },
  matchupscore: {
    fontSize: 20,
    color: "white",
    right: 4,
  },
  photo2: {
    position: "absolute",
    // Adjust the right position as needed
  },
  arrow: {
    alignItems: "flex-end",
    bottom: 52,
    left: 310,

    width: 30,
  },
  refresh: {
    alignItems: "flex-end",
    bottom: 1,
    left: 310,

    width: 30,
  },
  roundtitle: {
    fontSize: 20,
    color: "white",
    right: 4,
    fontWeight: "bold",
    padding: 25,
    backgroundColor: "#00B365",
    width: 180,
    margin: 20,
    textAlign: "center",
  },
  bgchamp: {
    backgroundColor: "#00B365",
    width: 400,
    alignSelf: "center",
    bottom: 20,
    height: 420,
  },
  champtitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  winner: {
    fontSize: 26,
    color: "#FFC727",
    fontWeight: "bold",
    textAlign: "center",
  },
});
