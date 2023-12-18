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
  Alert,
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
  getDoc,
  addDoc,
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";


export const PlayerFormationJoin = ({ navigation }) => {

  const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "users")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        const dataa = doc.data();
        if (dataa.role == "Coach") {
          items.push({ ...doc.data(), id: doc.id });
        }

      });
      setData(items);
    });
  };


 

 




const invitePlayer=async(CoachUid)=>{
    try {
        if(CoachUid==null){
            console.log("CoachUid == null")
        }
        
        const playerDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if(playerDoc.data().fullName!=""||playerDoc.data().profileImage!=""||playerDoc.data().position!=""){
        const fullName=playerDoc.data().fullName;
        const imageURL=playerDoc.data().profileImage;
        const position=playerDoc.data().position;
        
        // Create an invitation in Firestore
        const invitationRef = collection(db, "invitations",);
    const newInvitationDoc = await addDoc(invitationRef, {
      senderUid: auth.currentUser.uid, // Assuming user is the coach sending the invitation
      senderName:fullName,
      senderImage:imageURL,
      senderPosition:position,
      receiverUid: CoachUid,
      status: "Pending",
      // Add any additional details you want to include in the invitation
    });
  }else{
    Alert.alert("Empty Fields", "Please fill in all required fields.");

  }
        // Notify the player about the invitation
        // You can use FCM or another notification method here
  
        // Optional: Update UI or provide feedback to the coach
        console.log("Joining sent successfully!");
      } catch (error) {
        Alert.alert(" Update your profile", "Please fill all required fields.");
        console.log(error)
      }
}


  const render = ({ item }) => {
    
    return (
      <View className="p-4 bg-gray-100 top-1 text-gray-700 flex-row rounded-2xl ">
        {/* NEW navigate through stack (: */}
        <TouchableOpacity onPress={()=>navigation.navigate('PlayerProfile', { screen: 'PlayerVisitProfile' ,params: {itemId:item.id}})}>
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
          <Text>Ask to join</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-start">
       
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
