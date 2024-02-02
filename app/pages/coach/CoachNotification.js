import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
  where,
  arrayUnion,
} from "firebase/firestore";

import { db, auth } from "../../component/config/config";

export const CoachNotification = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);


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
  
  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };
  const deleteInvite = async (inviteId) => {
    await deleteDoc(doc(db, "invitations", inviteId));
    console.log("Deleted notification Successfully");
  };

  const handleInvite = async (text, inviteId, playerUid, coachUid) => {
    try {
      const invitationRef = doc(db, "invitations", inviteId);

      if (text === "Accepted") {
        // Update the invitation status to "Accepted"
        await updateDoc(invitationRef, { status: text });

        // Update the coach's document to add the player to the members array
        const playerRef = doc(db, "users", playerUid);
        const coachRef = doc(db, "users", coachUid);
        const clubDoc=await getDoc(coachRef)
        //retrieve Player Data
        const playerDoc = await getDoc(playerRef);
        const uid= playerDoc.data().uid;
        const imageURL = playerDoc.data().profileImage;
        const fullName = playerDoc.data().fullName;
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
          console.log("clubname empty");
        }
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
        });
        console.log("Member added");
        //here I let the player join in the team so i can use it with queries
        await updateDoc(playerRef, {
          clubName: clubName,
        });
      }else{
         // Club doesn't exist, create a new one
         await setDoc(doc(db, "clubs", clubName), {
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
        });
        console.log("New club created successfully");

        await updateDoc(playerRef, {
          clubName: clubName,
        });
      }
      
      
      } else {
        // Update the invitation status to "Rejected"
        await updateDoc(invitationRef, { status: text });

        // Delete the invitation
      }

      // Refresh the data after handling the invitation
      await deleteInvite(inviteId);

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
              navigation.navigate("CoachNotificationstack", {
                screen: "CoachVisitProfile",
                params: { itemId: item.senderUid },
              })
            }
          >
            <Avatar.Image size={75} source={{ uri: item.senderImage }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.text1} className="font-bold  ">
          {item.senderName}
        </Text>
        <Text style={styles.text2}>
          Player position:{" "}
          <Text style={{ fontWeight: "bold" }}>{item.senderPosition}</Text>
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
        <FlatList data={data} renderItem={render} 
         refreshControl={
               <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
             }
             />
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
