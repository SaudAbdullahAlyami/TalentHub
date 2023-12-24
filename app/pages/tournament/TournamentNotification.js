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
  }, []);

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
        
          invitations.push({ ...doc.data(), id: doc.id });
        

      });

      setData(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
    loadData()
  };

  const deleteInvite = async (inviteId) => {
    await deleteDoc(doc(db, "invitations", inviteId));
    console.log("Deleted Successfully");
  };

  const handleInvite = async (text, inviteId, coachUid, TournamentOrgnaizerUid) => {
    try {
      const invitationRef = doc(db, "invitations", inviteId);

      if (text === "Accepted") {
        // Update the invitation status to "Accepted"
        await updateDoc(invitationRef, { status: text });

        // Update the coach's document to add the player to the members array
        const TournamentOrgnaizer = getDoc(doc(db, "users", TournamentOrgnaizerUid));
        const tourName=(await TournamentOrgnaizer).data().TournamentName;

        const coachRef = doc(db, "users", coachUid);
        const coach=await getDoc(coachRef);
        const clubName=coach.data().clubName;

        await updateDoc(coachRef,{
            tournamet:tourName
        })

        const clubRef = doc(db, "clubs", clubName);
        const clubDoc = await getDoc(clubRef);
        const players=clubDoc.data().members
        
            await updateDoc(clubRef,{
                tournamet:tourName
            })
          console.log("Member added");
          
          await updateDoc(clubRef, {
            tournamet:tourName
          });

          await updateDoc(doc(db, "tournament", tourName), {
           name: clubName,
           players:players
        
          });
      
          
          console.log("New club joined in tournament");
        
        
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
        <TouchableOpacity onPress={()=>navigation.navigate('PlayerProfile', { screen: 'PlayerVisitProfile' ,params: {itemId:item.senderUid}})}>
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
          onPress={() => handleInvite("Rejected", item.id, item.senderUid,item.receiverUid)}
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
