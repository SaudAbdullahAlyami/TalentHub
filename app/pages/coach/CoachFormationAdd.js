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
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from "react-native-paper";
import { useAuthentication } from "../../useAuthentication";
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  getDocs,
  addDoc,getDoc
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const CoachFormationAdd = ({ navigation }) => {

  const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "users")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        const dataa = doc.data();
        if (dataa.role == "Player") {
          if(dataa.clubName=="")
          items.push({ ...doc.data(), id: doc.id });
        }

      });
      setData(items);
    });
  };


  



const invitePlayer=async(playerUid)=>{
    try {
        if(playerUid==null){
            console.log("Player uid == null")
        }
        const coachDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const fullName=coachDoc.data().fullName;
        const imageURL=coachDoc.data().profileImage;
        // Create an invitation in Firestore
        const invitationRef = collection(db, "invitations",);
    const newInvitationDoc = await addDoc(invitationRef, {
      senderUid: auth.currentUser.uid, 
      senderName:fullName,
      senderImage:imageURL,
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


  const render = ({ item }) => {
    
    return (
      <View className="p-4 bg-gray-100 top-1 text-gray-700 flex-row rounded-2xl ">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CoachFormationstack", {
              screen: "CoachVisitProfile",
              params: { itemId: item.uid },
            })
          }
        >
        <Avatar.Image
          backgroundColor="grey"
          size={150}
          source={{ uri: item.profileImage }}
        />
        </TouchableOpacity>
        
        <Text>{item.fullName}
        </Text>
        
        <TouchableOpacity
          onPress={()=>invitePlayer(item.id)}
          className="bg-yellow-400  p-3 rounded-tr-2x1 rounded-bl-2xl ml-2"
        >
          <Text>Invite</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-yellow-400 top-5 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
      </View>

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
