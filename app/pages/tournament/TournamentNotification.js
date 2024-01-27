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
      <View
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TournamentNotificationstack", {
              screen: "TournamentVisitProfile",
              params: { itemId: item.senderUid },
            })
          }
        >
          <Avatar.Image size={100} source={{ uri: item.senderImage }} />
        </TouchableOpacity>
        <Text>Coach :{item.senderName}</Text>

        <Button
          title="Accept"
          color={"green"}
          onPress={() =>
            handleInvite("Accepted", item.id, item.senderUid, item.receiverUid)
          }
        />
        <Button
          title="Reject"
          color={"red"}
          onPress={() =>
            handleInvite("Rejected", item.id, item.senderUid, item.receiverUid)
          }
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-start"></View>

      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white top-8 px-8 pt-8"
      >
        <FlatList data={data} renderItem={render} />

        <View className="bg-white my-9"></View>
      </View>
    </View>
  );
};
