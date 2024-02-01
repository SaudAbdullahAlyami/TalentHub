import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  doc,
  getDocs,
  getDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
  onSnapshot,
  where,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const TournamentNotification = ({ navigation }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    try {
      const invitationsRef = collection(db, "invitations");
      const q = query(
        invitationsRef,
        where("receiverUid", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
  
      const invitations = [];
      querySnapshot.forEach((doc) => {
        const invitationData = { id: doc.id, ...doc.data() };
  
        // Check if an invitation with similar data already exists in the array
        const existingInvitation = invitations.find(
          (existingInvitation) => existingInvitation.senderName === invitationData.senderName
        );
  
        // If it doesn't exist, push the invitation to the array
        if (!existingInvitation) {
          invitations.push(invitationData);
        }
      });
  
      setData(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const deleteInvite = async (inviteId) => {
    await deleteDoc(doc(db, "invitations", inviteId));
    console.log("Deleted Successfully");
  };

  const handleInvite = async (
    text,
    inviteId,
    coachUid,
    TournamentOrgnaizerUid
  ) => {
    try {
      const invitationRef = doc(db, "invitations", inviteId);

      if (text === "Accepted") {
        // Update the invitation status to "Accepted"
        await updateDoc(invitationRef, { status: text });

        // Update the coach's document to add the player to the members array
        const TournamentOrgnaizer = getDoc(
          doc(db, "users", TournamentOrgnaizerUid)
        );
        const tourName = (await TournamentOrgnaizer).data().tournament;

        const coachRef = doc(db, "users", coachUid);
        const coach = await getDoc(coachRef);
        const clubName = coach.data().clubName;
        const teamImage= coach.data().profileImage;
        await updateDoc(coachRef, {
          tournament: tourName,
        });
        console.log("tournament added to coach");

        const clubRef = doc(db, "clubs", clubName);
        const clubDoc = await getDoc(clubRef);

        await updateDoc(clubRef, {
          tournament: tourName,
        });
        console.log("tournament added to team");

         const players = clubDoc.data().formation;
        for (let i = 0; i < players.length; i++) {
        let uiid = players[i].uid;
          await updateDoc(doc(db, "users", uiid), {
          tournament: tourName
        });
 
 }

        const tournamentDoc = await getDoc(doc(db, "tournament", tourName));

        if (tournamentDoc.exists()) {
          const teamExists = tournamentDoc
            .data()
            .teams.some((team) => {team.name === clubName });

          if (!teamExists) {
            // Get the current teams array
            const currentTeams = tournamentDoc.data().teams;
            const arrayIndex = tournamentDoc.data().teamsArrayIndex;

            // Modify the team at the specified index
            currentTeams[arrayIndex] = {
              name: clubName,
              players: players,
              teamImage:teamImage
            };

          
            // Update the entire teams array in the document
            await updateDoc(doc(db, "tournament", tourName), {
              teams: currentTeams,
              teamsArrayIndex: arrayIndex + 1,
            });
            console.log("New club joined in tournament");
          } else {
            console.log("The team already exist");
          }
        } else {
          console.log("Tournament document does not exist");
        }
      } else {
        // Update the invitation status to "Rejected"
        await updateDoc(invitationRef, { status: text });
        // Delete the invitation
      }

      // Refresh the data after handling the invitation
      //await deleteInvite(inviteId);
      loadData();
    } catch (error) {
      console.error("Error handling invitation:", error);
    }
  };

  const render = ({ item }) => {
    return (
      <View style={styles.hi}>
        <View style={styles.pico}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TournamentNotificationstack", {
              screen: "TournamentVisitProfile",
              params: { itemId: item.senderUid },
            })
          }
        >
            <Avatar.Image size={75} source={{ uri: item.senderImage }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.text1} className="font-bold  ">
          {item.senderClub}
        </Text>
        <Text style={styles.text2}>
          Club coach:{" "}
          <Text style={{ fontWeight: "bold" }}>{item.senderName}</Text>
        </Text>

        <TouchableOpacity
          style={styles.button1}
          onPress={() =>
            handleInvite("Accepted", item.id, item.senderUid, item.receiverUid)
          }
          className="py-3  self-end	 right-2  w-28 rounded-xl"
        >
          <Text className=" text-center text-white">Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleInvite("Rejected", item.id, item.senderUid)}
          className="py-3 bg-red-500 w-28 self-end right-2 bottom-20  	rounded-xl"
        >
          <Text className="text-  text-center text-white">Reject</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 " style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-center top-10">
        <Image
          source={require("../../assets/coachnoti.png")}
          style={{ width: 150, height: 150 }}
        />
      </View>

      <View
        style={{ backgroundColor: "white", paddingBottom: 10 }}
        className="flex-1 bg-white top-16"
      >
        <FlatList data={data} renderItem={render} />
      </View>
      <View className="bg-white my-6"></View>
    </View>
  );
};
const styles = StyleSheet.create({
  pico: {
    top: 32,
    paddingLeft: 18,
  },
  text1: {
    fontSize: 18,
    left: 103,
    bottom: 30,
  },
  text2: {
    fontSize: 14,
    left: 103,
    bottom: 25,
  },
  button1: {
    backgroundColor: "#00b365",
    bottom: 85,
  },
  hi: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 140,
    marginLeft: 10,
  },
});
