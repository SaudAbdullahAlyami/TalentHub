import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, FlatList } from "react-native";
import { Avatar } from "react-native-paper";
import {
  doc,
  getDocs,
  getDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
  where,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { db, auth, firebaase } from "../../component/config/config";

export const PlayerNotification = ({ navigation }) => {
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

      const playerRef = getDoc(doc(db, "users", auth.currentUser.uid));
      const haveATeam = (await playerRef).data().clubName;

      const invitations = [];
      querySnapshot.forEach((doc) => {
        const dataa = doc.data();

        if (haveATeam == "") invitations.push({ ...doc.data(), id: doc.id });
      });

      setData(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
    loadData();
  };

  const deleteInvite = async (inviteId) => {
    await deleteDoc(doc(db, "invitations", inviteId));
    console.log("Deleted Successfully");
  };

  const handleInvite = async (text, inviteId, coachUid, playerUid) => {
    try {
      const invitationRef = doc(db, "invitations", inviteId);

      if (text === "Accepted") {
        // Update the invitation status to "Accepted"
        await updateDoc(invitationRef, { status: text });

        // Update the coach's document to add the player to the members array
        const playerRef = doc(db, "users", playerUid);
        const coachRef = doc(db, "users", coachUid);

        //retrieve Player Data
        const playerDoc = await getDoc(playerRef);
        const imageURL = playerDoc.data().profileImage;
        const fullName = playerDoc.data().fullName;
        const uid= playerDoc.data().uid;
        const age = playerDoc.data().age;
        const height = playerDoc.data().height;
        const weight = playerDoc.data().weight;
        const level = playerDoc.data().level;
        const position = playerDoc.data().position;
        const phoneNumber = playerDoc.data().phoneNumber;
        const assist = playerDoc.data().assist;
        const clearances = playerDoc.data().clearances;
        const crosses = playerDoc.data().crosses;
        const goals = playerDoc.data().goals;
        const passes = playerDoc.data().passes;
        const rating = playerDoc.data().rating;
        const shotsOnTarget = playerDoc.data().shotsOnTarget;
        const saves = playerDoc.data().saves;
        const tackles = playerDoc.data().tackles;


        const coachDoc = await getDoc(coachRef);
        const clubName = coachDoc.data().clubName;
        const description = coachDoc.data().description;
        const city = coachDoc.data().city;
        if (clubName == "") {
          console.log("clubnameempty");
        }

        const clubRef = doc(db, "clubs", clubName);
        const clubDoc = await getDoc(clubRef);

        if (clubDoc.exists()) {
          await updateDoc(doc(db, "clubs", clubName), {
            members: arrayUnion({
              fullName: fullName,
              age: age,
              height: height,
              weight: weight,
              level: level,
              profileImage: imageURL,
              position: position,
              uid: uid,
              phoneNumber:phoneNumber,
              assist:assist,
              crosses:crosses,
              clearances:clearances,
              tackles:tackles,
              saves:saves,
              shotsOnTarget:shotsOnTarget,
              rating:rating,
              passes:passes,
              goals:goals
            }),
            clubName: clubName,
            description: description,
            city: city,
            tournament:""
          });
          console.log("Member added");
          //here I let the player join in the team so i can use it with queries
          await updateDoc(playerRef, {
            clubName: clubName,
          });
        } else {
          // Club doesn't exist, create a new one
          await setDoc(clubRef, {
            members: arrayUnion({
              fullName: fullName,
              age: age,
              height: height,
              weight: weight,
              level: level,
              profileImage: imageURL,
              position: position,
              uid: uid,
              phoneNumber:phoneNumber,
              assist:assist,
              crosses:crosses,
              clearances:clearances,
              tackles:tackles,
              saves:saves,
              shotsOnTarget:shotsOnTarget,
              rating:rating,
              passes:passes,
              goals:goals
            }),
            clubName: clubName,
            description: description,
            city: city,
            tournament:""
          });
          console.log("New club created successfully");
        }
        await updateDoc(playerRef, {
          clubName: clubName,
        });
      } else {
        // Update the invitation status to "Rejected"
        //await updateDoc(invitationRef, { status: text });
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
            navigation.navigate("PlayerNotificationstack", {
              screen: "PlayerVisitCoach",
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
          onPress={() => handleInvite("Rejected", item.id, item.senderUid)}
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
