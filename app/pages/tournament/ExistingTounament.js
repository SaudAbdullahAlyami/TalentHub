import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  doc,
  getDoc,
  getDocs,
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
          team1Goals: '0',
          team2Goals: '0'
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
    
    }
  };

  const fetchRound4 = async () => {
    try {
      const tournamentRef = doc(db, "tournament", tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
      console.log("Joined Round 4");
      generateMatchupsRound4(tournamentDoc.data().matchsRound4);
    } catch (error) {
   
    }
  };

  return (

    <View style={styles.container}>
      <ScrollView>

        <View className="flex-row justify-center"  >

          <Image source={require("../../assets/tour2.png")}
            style={{ width: 300, height: 300 }} />
        </View>
        <Text className="self-center bottom-5 " style={styles.title}>Tournament Bracket</Text>



        <View className="flex-1 bg-white  px-8 pt-3  rounded-tr-3xl rounded-tl-2xl  self-center" style={{ width: 400 }}>



          <TouchableOpacity style={styles.refresh} onPress={() => getData()}>
            <Image source={require("../../assets/refresh.png")}
              style={{ width: 30, height: 30 }} />

          </TouchableOpacity>



          {matchups.length == 0 && (
            <TouchableOpacity onPress={() => generateMatchups()}>
              <Text className="self-center bottom-5   rounded-3xl" style={styles.roundtitlestart} >Start Round of 16</Text>
            </TouchableOpacity>
          )}

          <Text className="self-center bottom-9  rounded-3xl " style={styles.roundtitle} >Round of 16</Text>
          {matchups.map((matchup,) => (
            <View style={styles.hi}>
              <View style={styles.matchupContainer}>

                <Avatar.Image style={styles.photo1} backgroundColor="grey"
                  size={40}
                  source={({ uri: matchup.team1.teamImage })}

                />
                <Avatar.Image style={styles.photo2} backgroundColor="pink" className="left-52"
                  size={40}
                  source={({ uri: matchup.team2.teamImage })}
                />


                <View className="w-20 items-end">
                  <Text style={styles.matchupText} >
                    {matchup.team1.name}
                  </Text>
                </View>


                <View className="w-20 items-start">
                  <Text style={styles.matchupText2}>
                    {matchup.team2.name}
                  </Text></View>




                {/* <Text> Winner is :{matchup.whoWin}</Text>  */}

              </View>


              <View className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l" style={{ backgroundColor: "#00B365" }}         >
                <Text className="top-1 font-bold " style={styles.matchupscore}>   {matchup.team1Goals} - {matchup.team2Goals} </Text>
              </View>


              <TouchableOpacity style={styles.arrow} onPress={() => handleMatchButtonClick(matchup, 1)}>
                <Image source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 15 }} />
              </TouchableOpacity>


            </View>



          ))

          }

          {round1Complete && matchupsRound2.length == 0 && (
            <TouchableOpacity onPress={() => fetchRound2()}>
              <Text className="self-center bottom-5   rounded-3xl" style={styles.roundtitlestart} >Start Quarter-finals</Text>
            </TouchableOpacity>
          )}


          <Text className="self-center bottom-5 items-center  rounded-3xl" style={styles.roundtitle} >Quarter-finals</Text>
          {matchupsRound2.map((matchup,) => (
            <>

              <View style={styles.hi}>
                <View style={styles.matchupContainer}>
                  <Avatar.Image style={styles.photo1} backgroundColor="grey"
                    size={40}
                    source={({ uri: matchup.team1.teamImage })}

                  />
                  <Avatar.Image style={styles.photo2} backgroundColor="pink" className="left-52"
                    size={40}
                    source={({ uri: matchup.team2.teamImage })}
                  />

                  <View className="w-20 items-end">
                    <Text style={styles.matchupText} >
                      {matchup.team1.name}
                    </Text>
                  </View>


                  <View className="w-20 items-start">
                    <Text style={styles.matchupText2}>
                      {matchup.team2.name}
                    </Text></View>
                </View>

                <View className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l" style={{ backgroundColor: "#00B365" }}         >
                  <Text className="top-1 font-bold " style={styles.matchupscore}>   {matchup.team1Goals} - {matchup.team2Goals} </Text>
                </View>

                <TouchableOpacity style={styles.arrow} onPress={() => handleMatchButtonClick(matchup, 2)}>
                  <Image source={require("../../assets/arrow.png")}
                    style={{ width: 20, height: 15 }} />
                </TouchableOpacity>

              </View>
            </>
          ))}

          {round2Complete && matchupsRound3.length == 0 && (
            <TouchableOpacity onPress={() => fetchRound3()}>
              <Text className="self-center bottom-5   rounded-3xl" style={styles.roundtitlestart} >Start Semi-finals</Text>
            </TouchableOpacity>
          )}
          <Text className="self-center bottom-5 rounded-3xl" style={styles.roundtitle}>Semi-finals</Text>
          {matchupsRound3.map((matchup,) => (
            <>


              <View style={styles.hi}>

                <View style={styles.matchupContainer}>
                  <Avatar.Image style={styles.photo1} backgroundColor="grey"
                    size={40}
                    source={({ uri: matchup.team1.teamImage })}

                  />
                  <Avatar.Image style={styles.photo2} backgroundColor="pink" className="left-52"
                    size={40}
                    source={({ uri: matchup.team2.teamImage })}
                  />

                  <View className="w-20 items-end">
                    <Text style={styles.matchupText} >
                      {matchup.team1.name}
                    </Text>
                  </View>


                  <View className="w-20 items-start">
                    <Text style={styles.matchupText2}>
                      {matchup.team2.name}
                    </Text></View>
                </View>

                <View className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l" style={{ backgroundColor: "#00B365" }}         >
                  <Text className="top-1 font-bold " style={styles.matchupscore}>   {matchup.team1Goals} - {matchup.team2Goals} </Text>
                </View>

                <TouchableOpacity style={styles.arrow} onPress={() => handleMatchButtonClick(matchup, 3)}>
                  <Image source={require("../../assets/arrow.png")}
                    style={{ width: 20, height: 15 }} />
                </TouchableOpacity>


              </View>
            </>
          ))}
          {round3Complete && matchupsRound4.length == 0 && (

            <TouchableOpacity onPress={() => fetchRound4()}>
              <Text className="self-center bottom-5   rounded-3xl" style={styles.roundtitlestart} >Start Final</Text>
            </TouchableOpacity>
          )}
          <Text className="self-center bottom-5   rounded-3xl" style={styles.roundtitle} >Final</Text>
          {matchupsRound4.map((matchup,) => (
            <>




              <View style={styles.hif}>

                <View style={styles.matchupContainer}>


                  <Avatar.Image style={styles.photo1} backgroundColor="grey"
                    size={40}
                    source={({ uri: matchup.team1.teamImage })}
                  />
                  <Avatar.Image style={styles.photo2} backgroundColor="pink" className="left-52"
                    size={40}
                    source={({ uri: matchup.team2.teamImage })}
                  />

                  <View className="w-20 items-end">
                    <Text style={styles.matchupText} >
                      {matchup.team1.name}
                    </Text>
                  </View>


                  <View className="w-20 items-start">
                    <Text style={styles.matchupText2}>
                      {matchup.team2.name}
                    </Text></View>
                </View>

                <View className=" w-16 h-9 bottom-7 self-center rounded-r rounded-l" style={{ backgroundColor: "#00B365" }}         >
                  <Text className="top-1 font-bold " style={styles.matchupscore}>   {matchup.team1Goals} - {matchup.team2Goals} </Text>
                </View>

                <TouchableOpacity style={styles.arrow} onPress={() => handleMatchButtonClick(matchup, 4)}>
                  <Image source={require("../../assets/arrow.png")}
                    style={{ width: 20, height: 15 }} />
                </TouchableOpacity>






                <View className="items-center" style={styles.bgchamp}>
                  <Image source={require("../../assets/trophy.png")}
                    style={{ width: 300, height: 200 }} />

                  <Text className="top-3" style={styles.champtitle} >Tornament Champion</Text>

                  <Text className="top-3" style={styles.winner} >{matchup.whoWin}</Text>


                 


                  
                </View>




              </View>

            </>
          ))}




        </View>





 <TouchableOpacity onPress={() => DeleteTournament()}>
                    <Text className="self-center bottom-5 my-9  rounded-3xl" style={styles.roundtitlestart} >Start New Tournament</Text>
                  </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    , backgroundColor: "#00B365"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: 'white'
  },
  matchupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  matchupText: {
    fontSize: 12,

    fontWeight: 'bold',
    color: "#00B365",


  }, matchupText2: {
    fontSize: 12,

    fontWeight: 'bold',
    color: "#00B365",


  },
  hi: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 50,
    marginBottom: 23,
  }, hif: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 50,
    marginBottom: 320,

  },
  button1: {

    position: 'absolute',
    top: 300, // Adjust the top position as needed
    right: 10, // Adjust the right position as needed

    padding: 10,
    borderRadius: 5,

  },
  photo1: {


    position: 'absolute',
    left: 88,
    // Adjust the right position as needed




  }, matchupscore: {
    fontSize: 20,
    color: "white",
    right: 4,


  }, photo2: {


    position: 'absolute',
    // Adjust the right position as needed




  }, arrow: {

    alignItems: 'flex-end',
    bottom: 52,
    left: 310,

    width: 30,


  }, refresh: {

    alignItems: 'flex-end',
    bottom: 1,
    left: 310,

    width: 30,


  }, roundtitle: {
    fontSize: 20,
    color: "white",
    right: 4,
    fontWeight: "bold",
    padding: 25,
    backgroundColor: "#00B365",
    width: 180,
    margin: 20,
    textAlign: 'center'


  }, bgchamp: {
    backgroundColor: "#00B365",
    width: 400,
    alignSelf: "center",
    bottom: 20,
    height: 420,
  }, champtitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: 'center'


  }, winner: {
    fontSize: 26,
    color: "#FFC727",
    fontWeight: "bold",
    textAlign: 'center'


  },roundtitlestart: {
    fontSize: 20,
    color: "white",
    right: 4,
    fontWeight: "bold",
    padding: 25,
    backgroundColor: "#FFC727",
    width: 210,
    margin: 20,
    textAlign: 'center'


  }
});
