import React, { useState, useEffect, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,  Alert, ScrollView
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  doc,
  updateDoc,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

import { db, auth, firebaase } from "../../component/config/config";

export const AddingPlayersManualy = ({ route, navigation }) => {
  const [members, setMembers] = useState([]);

  const [clubName, setclubName] = useState("");

  const { index } = route.params
  console.log("the", index)


  useEffect(() => {
    fetchData();
    // Clean up the subscription when the component unmounts
    return () => {
      /* Cleanup logic if needed */
    };
  }, []);

  const fetchData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      if (userClubName) {
        const clubDoc = await getDoc(doc(db, "clubs", userClubName));
        setMembers(clubDoc.data().members);
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const deletePlayer = async (playerUid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      if (userClubName) {
        const memberIdToRemove = playerUid;
        const clubRef = doc(db, "clubs", userClubName);

        // Get the current members array
        const clubDoc = await getDoc(clubRef);
        const currentMembers = clubDoc.data().members || []; // Ensure it's an array or default to an empty array

        // Find the index of the playerUid in the array
        const indexToRemove = currentMembers.findIndex(
          (member) => member.uid === memberIdToRemove
        );

        if (indexToRemove !== -1) {
          // Use arrayRemove to remove the specified member from the array
          await updateDoc(clubRef, {
            members: arrayRemove(currentMembers[indexToRemove]),
          });

          console.log("Player was deleted");

          // Update the user document to remove the clubName
          await updateDoc(doc(db, "users", playerUid), {
            clubName: "",
          });

          fetchData(); // Assuming fetchData is a function that fetches updated data
        } else {
          console.error("Player not found in the members array.");
        }
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  // ==========================================Working hereee====================================================

  const addmanualy = async (playerUid, index) => {
    const playerRef = doc(db, "users", playerUid);
    const playerDoc = await getDoc(playerRef);

    if (!playerDoc.exists()) {
      console.log("Player document does not exist!");
      return;
    }

    const clubName = playerDoc.data().clubName;
    const clubRef = doc(db, "clubs", clubName);
    const clubDoc = await getDoc(clubRef);

    let currentFormation = clubDoc.data()?.formation || [];

    // Check if player already exists in the formation array
    const playerExists = currentFormation.some((player) => player?.uid === playerDoc.data().uid);

    if (playerExists) {
      Alert.alert("The player is already in the formation!");
      return;
    }

    // Add the player at the specified index
    if (currentFormation.length >= index + 1) {
      currentFormation[index] = {
        fullName: playerDoc.data()?.fullName || "",
        position: playerDoc.data()?.position || "",
        uid: playerDoc.data()?.uid || "",
        goals: playerDoc.data().goals,
        assist: playerDoc.data().assist,
        rating: playerDoc.data().rating,
        saves: playerDoc.data().saves,
        clearances: playerDoc.data().clearances,
        tackles: playerDoc.data().tackles,
        crosses: playerDoc.data().crosses,
        passes: playerDoc.data().passes,
        shotsOnTarget: playerDoc.data().shotsOnTarget,
      };
    } else {
      // If the array is smaller than the specified index, pad with empty values
      while (currentFormation.length < index) {
        currentFormation.push(null);
        console.log("stuck in the loop");
      }

      currentFormation[index] = {
        fullName: playerDoc.data()?.fullName || "",
        position: playerDoc.data()?.position || "",
        uid: playerDoc.data()?.uid || "",
        goals: playerDoc.data().goals,
        assist: playerDoc.data().assist,
        rating: playerDoc.data().rating,
        saves: playerDoc.data().saves,
        clearances: playerDoc.data().clearances,
        tackles: playerDoc.data().tackles,
        crosses: playerDoc.data().crosses,
        passes: playerDoc.data().passes,
        shotsOnTarget: playerDoc.data().shotsOnTarget,
      };
    }

    await updateDoc(clubRef, {
      formation: currentFormation,
    });

    console.log("Member added to the formation array!!", index);
    Alert.alert("Successfully ","Member added to the formation.")
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, []);

  const renderPlayers = (players, title, navigation) => {
    return (
      <View >

        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#00B365", padding: 20, }}>{title}</Text>


        {players.map((item) => {
          return (
            <View style={styles.pico} key={item.uid}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CoachFormationstack", {
                    screen: "CoachVisitProfile",
                    params: { itemId: item.uid },
                  })
                }
              >
                <Avatar.Image

                  size={70}
                  source={{ uri: item.profileImage }}
                />
              </TouchableOpacity>

              <View  >


                <Text className="font-bold top-5" style={styles.text1}> {item.fullName}</Text>
                <Text className=" top-5 " style={styles.text2}>{item.position}</Text>


                <TouchableOpacity style={styles.button1}


                  onPress={() => addmanualy(item.uid, index)}
                >
                  <Image
                    source={require("../../assets/arrow.png")}
                    style={{ width: 20, height: 15, }} />
                </TouchableOpacity>
              </View>


            </View>
          );
        })}
      </View>
    );
  };

  const groupedPlayers = {
    Goalkeepers: members.filter((item) => item.position === "GK"),
    Defenders: members.filter(
      (item) =>
        item.position === "RB" ||
        item.position === "LB" ||
        item.position === "CB"
    ),
    Midfielders: members.filter((item) => item.position === "CM"),
    Forwards: members.filter(
      (item) =>
        item.position == "LW" || item.position == "RW" || item.position == "ST"
    ),
  };

  return (
    <View className="flex-1 " style={{ backgroundColor: "#00B365" }} >
      <View className="flex-row justify-center top-19">

      </View>
      <View className="flex-row justify-start">
          <TouchableOpacity onPress={() => navigation.goBack()}
            className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>

      <View
        style={{ backgroundColor: "white", paddingBottom: 10,flex:1 }}
        
      >
        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {Object.keys(groupedPlayers).map((title) =>
            renderPlayers(groupedPlayers[title], title, navigation)
          )}

          
        </ScrollView>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: "2%",
  },
  position: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: "2%",
  },

  pico: {
    paddingLeft: 18,
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    padding: 17




  },
  text1: {
    fontSize: 18,
    left: 15,



  },
  text2: {
    fontSize: 14,
    left:20,

  },
  button1: {
    left: 260


  },
  hi: {
    marginLeft: 10,


  },
});