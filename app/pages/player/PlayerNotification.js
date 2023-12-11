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
  collection,
  query,
  updateDoc,
  deleteDoc,onSnapshot,
  where,arrayUnion
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const PlayerNotification = ({ navigation }) => {
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
        invitations.push({ id: doc.id, ...doc.data() });
      });

      setData(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };


  const [members, setMembers] = useState([]); 
  const [imageURL, setImageURL] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);
  



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

        const unsubscribe = onSnapshot(playerRef, (doc) => {
          setFullName(doc.data().fullName);
          setAge(doc.data().age);
          setHeight(doc.data().height);
          setWeight(doc.data().weight);
          setLevel(doc.data().level);
          setImageURL(doc.data().profileImage)
          setPosition(doc.data().position)
          setMembers(doc.data().members);
      });

        await updateDoc(coachRef, {
          members: arrayUnion({ 
            fullName: fullName, age: age, height:height, weight:weight,level:level,profileImage:imageURL,position:position
           }),
        });


      } else {
        // Update the invitation status to "Rejected"
        await updateDoc(invitationRef, { status: text });

        // Delete the invitation
        await deleteInvite(inviteId);
      }

      // Refresh the data after handling the invitation
      loadData();
    } catch (error) {
      console.error("Error handling invitation:", error);
    }
  };

  const render = ({ item }) => {
    return (
      <View style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 16, marginBottom: 16 }}>
        <Avatar.Image size={100} source={{ uri: item.senderImage }} />
        <Text>{item.massage}</Text>
        <Button
          title="Accept"
          color={"green"}
          onPress={() => handleInvite("Accepted", item.id, item.senderUid, item.receiverUid)}
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
/*


<View style={styles.playerCard}>
        
        <Image source={{uri: item.profileImage }} style={styles.playerImage} />
        <Text style={styles.playerName}>{item.name}</Text>
        <Text>sender is:{item.senderUid}</Text>
       
      </View>


<View style={styles.container}>
        <FlatList data={data}
         renderItem={render}




const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  playerCard: {
    width: 120,
    height: 180,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 8,
    overflow: 'hidden',
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  playerImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  playerName: {
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});



*/