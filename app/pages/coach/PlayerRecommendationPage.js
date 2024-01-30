import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity, StyleSheet, ScrollView,Image

} from "react-native";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { Avatar } from "react-native-paper";
import { db, auth, firebaase } from "../../component/config/config";

import axios from 'axios';

export const PlayerRecommendationPage = ({ route, navigation }) => {
  const { index } = route.params;

  const [position, setPosition] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [clubName, setclubName] = useState("");


  useEffect(() => {
    // This effect will be called whenever `position` changes.
    handleGetRecommendations();
  }, [position]); // Only re-run the effect if `position` changes.

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (coachDoc.exists()) {
          const clubName = coachDoc.data().clubName;
          setclubName(clubName);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleGetRecommendations = async () => {
    try {
      console.log('the index', index);
      if (index === 0) {
        setPosition('LW');
      } else if (index === 1) {
        setPosition('ST');
      } else if (index === 2) {
        setPosition('RW');
      } else if (index === 3) {
        setPosition('CM');
      } else if (index === 4) {
        setPosition('CM');
      } else if (index === 5) {
        setPosition('CM');
      } else if (index === 6) {
        setPosition('LB');
      } else if (index === 7) {
        setPosition('CB');
      } else if (index === 8) {
        setPosition('CB');
      } else if (index === 9) {
        setPosition('RB');
      } else if (index === 10) {
        setPosition('GK');
      }

      if (!position) {
        console.log('Position is required');
        return;
      }

      const data = {
        fullName: 'Player3',
        position: position,
        height: 185,
        weight: 80,
        age: 9,
        assist: 22,
        clearances: 23,
        crosses: 22,
        goals: 60,
        passes: 100,
        rating: 10,
        saves: 0,
        shotsOnTarget: 99,
        tackles: 100
      };

      const response = await axios.post(
        'http://46.101.208.187/api/get_recommendations',
        data,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = response.data;
      setRecommendations(responseData.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const addPlayer = async (playerUid) => {
    // Delete the statment
    console.log("the player info is ", playerUid, "andddd", index)

    const playerRef = doc(db, "users", playerUid);
    const playerDoc = await getDoc(playerRef);

    if (!playerDoc.exists()) {
      console.log("Player document does not exist!");
      return;
    }

    const clubName = playerDoc.data().clubName;

    // Here is the Error 
    if (!clubName) {
      console.log("Club name is required");
      return
    }

    const clubRef = doc(db, "clubs", clubName);
    const clubDoc = await getDoc(clubRef);

    let currentFormation = clubDoc.data()?.formation || [];

    if (currentFormation.length >= index + 1) {
      // Update existing array at the specified index

      currentFormation[index] = {
        fullName: playerDoc.data()?.fullName || "",
        age: playerDoc.data()?.age || 0,
        height: playerDoc.data()?.height || 0,
        weight: playerDoc.data()?.weight || 0,
        level: playerDoc.data()?.level || "",
        profileImage: playerDoc.data()?.imageURL || "",
        position: playerDoc.data()?.position || "",
        uid: playerDoc.data()?.uid || "",

        assist: playerDoc.data()?.assist || 0,
        clearances: playerDoc.data()?.clearances || 0,
        crosses: playerDoc.data()?.crosses || 0,
        goals: playerDoc.data()?.goals || 0,
        passes: playerDoc.data()?.passes || 0,
        rating: playerDoc.data()?.rating || 0,
        saves: playerDoc.data()?.saves || 0,
        shotsOnTarget: playerDoc.data()?.shotsOnTarget || 0,
        tackles: playerDoc.data()?.tackles || 0,

      };
    } else {
      // If the array is smaller than the specified index, pad with empty values
      while (currentFormation.length < index) {
        currentFormation.push(null);
        console.log("stuck in the loop");
      }

      // Add the player at the specified index
      currentFormation[index] = {
        fullName: playerDoc.data()?.fullName || "",
        age: playerDoc.data()?.age || 0,
        height: playerDoc.data()?.height || 0,
        weight: playerDoc.data()?.weight || 0,
        level: playerDoc.data()?.level || "",
        profileImage: playerDoc.data()?.imageURL || "",
        position: playerDoc.data()?.position || "",
        uid: playerDoc.data()?.uid || "",

        assist: playerDoc.data()?.assist || 0,
        clearances: playerDoc.data()?.clearances || 0,
        crosses: playerDoc.data()?.crosses || 0,
        goals: playerDoc.data()?.goals || 0,
        passes: playerDoc.data()?.passes || 0,
        rating: playerDoc.data()?.rating || 0,
        saves: playerDoc.data()?.saves || 0,
        shotsOnTarget: playerDoc.data()?.shotsOnTarget || 0,
        tackles: playerDoc.data()?.tackles || 0,
      };
    }

    await updateDoc(clubRef, {
      formation: currentFormation,
      clubName,
      description: clubDoc.data()?.description || "",
      city: clubDoc.data()?.city || "",
    });

    console.log("Member added to the formation array!!");

  }

  const invitePlayer = async (playerUid) => {
    try {
      if (playerUid == null) {
        console.log("Player uid == null")
      }
      const coachDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const fullName = coachDoc.data().fullName;
      const imageURL = coachDoc.data().profileImage;
      // Create an invitation in Firestore
      const invitationRef = collection(db, "invitations",);
      const newInvitationDoc = await addDoc(invitationRef, {
        senderUid: auth.currentUser.uid,
        senderName: fullName,
        senderImage: imageURL,
        receiverUid: playerUid,
        status: "Pending",

        // Add any additional details you want to include in the invitation
      });

      // Notify the player about the invitation
      // You can use FCM or another notification method here

      // Optional: Update UI or provide feedback to the coach
      console.log("Invitation sent successfully!");
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  }

  return (
    <View style={{ backgroundColor: "white", width: 400 }}>
       


      {recommendations.length > 0 && (
        <View>
          <ScrollView >
           
            {recommendations.map((player, index) => (
              <>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("CoachFormationstack", {
                      screen: "CoachVisitProfile",
                      params: { itemId: player.uid },
                    })
                  }
                >
                  <View className="mb-9" style={styles.teamco} >


                    <Avatar.Image className="left-3 top-3" size={75} source={{ uri: player.profileImage }} />



                  </View>

                </TouchableOpacity>
                <Text className="font-bold left-24 bottom-7 "  >{player.fullName}{"\n"}{player.position}</Text>

                <View style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "ddd", borderBottomWidth: StyleSheet.hairlineWidth, }} >


                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Age {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.age}</Text>
                      </View>

                    </Text>

                  </View>



                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Height {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.height}</Text>
                      </View>

                    </Text>

                  </View>


                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Weight {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.weight}</Text>
                      </View>

                    </Text>
                   
                  </View>



                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Rating {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.rating}</Text>
                      </View>

                    </Text>
                    <View className="my-2"></View>
                  </View>
                      <View className="my-2"></View>
                </View>

                <View className="my-3"></View>
                <View style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "ddd", borderBottomWidth: StyleSheet.hairlineWidth, }} >


                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Goals {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.goals}</Text>
                      </View>

                    </Text>

                  </View>



                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Assists {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.assist}</Text>
                      </View>

                    </Text>

                  </View>


                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}>Shots On Target{"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.shotsOnTarget}</Text>
                      </View>

                    </Text>

                  </View>



                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Crosses {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.crosses}</Text>
                      </View>

                    </Text>

                    <View className="my-2"></View>
                  </View>
                      <View className="my-2"></View>
                </View>

                <View className="my-3"></View>
                <View style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "ddd", borderBottomWidth: StyleSheet.hairlineWidth, }} >


                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}> Saves {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player. saves}</Text>
                      </View>

                    </Text>

                  </View>



                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}>Clearances {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.clearances}</Text>
                      </View>

                    </Text>

                  </View>


                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}>Tackles {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text style={styles.text}>{player.tackles}</Text>
                      </View>

                    </Text>

                  </View>



                  <View style={styles.inputContainer}>
                    <Text className=" text-center   pb-2 font-bold" key={index}>Passes {"\n"}{"\n"}

                      <View style={styles.bigBox}>
                        <Text      style={styles.text}>{player.passes}</Text>

                        
                      </View>

                    </Text>
                     
                  </View>

                        
                 
                 
                </View>
                     

               

              

                {player.clubName === clubName ? (
                 <TouchableOpacity onPress={() => addPlayer(player.uid)}>
                 <Text className="self-center   rounded-3xl" style={styles.Button2} >Add player</Text>
               </TouchableOpacity>
                ) : (
                  <Button title="Invite Player" onPress={() => invitePlayer(player.uid)} />
                )}
               

              </>
                  
            ))}</ScrollView>
        </View>
      )}
     
        
         

     
          
     
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",


  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 1,
    marginTop: 39,
    color: "white"
  },
  playerContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",

    paddingHorizontal: 13,


  },
  input: {

    borderWidth: 1,
    borderColor: 'grey',
    height: 32,
    padding: 30,
    backgroundColor: "grey",
    paddingHorizontal: 30
  }, goalscon: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 8,
    padding: 20,
    left: 42

  }, hi: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,

    marginBottom: 15,
  }, bgcolor: {

    backgroundColor: "#00B365"
  }, teamco: {
    backgroundColor: "#00B365",
    width: 400,
    height: 40,
    fontSize: 28,

  }, teampl: {
    backgroundColor: "#00B365",
    width: 400,
    height: 40,
    fontSize: 20,
    paddingTop: 5,
    paddingLeft: 5,

  }, teamco2: {
    backgroundColor: "#FFD14E",
    width: 400,
    height: 40,
    fontSize: 28,
  }, button1: {
    backgroundColor: "#00b365",

  }, bigBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  }, Button2: {
    fontSize: 20,
    color: "white",
    right: 4,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "#00B365",
    width: 180,
    margin: 15,
    textAlign: 'center'


  }
});
