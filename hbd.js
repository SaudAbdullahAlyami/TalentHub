/*


player/formation


import React from "react";
import { View, Text,TouchableOpacity,Image,StyleSheet } from "react-native"
import { StatusBar } from "react-native";

export const Formation = ({ navigation }) => {
  return (
    
    <View className="flex-1" style={{backgroundColor: "#00B365"}}>
    <View className="flex-1 flex justify-around my-5">


        <View className="flex-row justify-center top-7" >
            <Image source={require("../../assets/field.jpg")}
                style={{width: 350, height: 500}} />
        </View>
 


                <TouchableOpacity  style={styles.posstiongk}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">GK</Text>
                </TouchableOpacity>
                


                <TouchableOpacity style={styles.posstionLb}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">LB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionRb}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">RB</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.posstionCb1}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCb2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>
                   

                <TouchableOpacity style={styles.posstionCm1}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCm2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">CM</Text>
                </TouchableOpacity>
               


                <TouchableOpacity style={styles.posstionCm3}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionLw}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">LW</Text>
                </TouchableOpacity>
 

                <TouchableOpacity style={styles.posstionRw}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">RW</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionSt}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">ST</Text>
                </TouchableOpacity>


                </View>

        </View>

  );
};






const styles = StyleSheet.create({
  posstionLb: {
    bottom:160,
    left:60,
    width:40,
    height:40,
    
  },
  posstiongk: {
    bottom:15,
    width:40,
    height:40,
    
    alignSelf:'center'
  },
  posstionRb: {
    bottom:170,
    left:314,
    width:40,
    height:40,
   
  },
  posstionCb1: {
    bottom:134,
    left:245,
    width:40,
    height:40,
    
  },
  posstionCb2: {
    bottom:150,
    left:130,
    width:40,
    height:40,
  
  },
  posstionCm1: {
    bottom:280,
    alignSelf:'center',
    width:40,
    height:40,
   
  },
  posstionCm2: {
    bottom:355,
    width:40,
    left:110,
    height:40,
   
    
  },
  posstionCm3: {
    bottom:370,
    left:263,
    width:40,
    height:40,
    
  },
  posstionLw: {
    bottom:475,
    left:60,
    width:40,
    height:40,
    
  },
  posstionRw: {
    bottom:490,
    left:310,
    width:40,
    height:40,
 
  },
  posstionSt: {
    bottom:565,
    width:40,
    height:40,
   
    alignSelf:'center',
  },
});










//player/playernotifaion


import React from "react";
import { View, Text,TouchableOpacity,Image,StyleSheet } from "react-native"
import { StatusBar } from "react-native";

export const Formation = ({ navigation }) => {
  return (
    
    <View className="flex-1" style={{backgroundColor: "#00B365"}}>
    <View className="flex-1 flex justify-around my-5">


        <View className="flex-row justify-center top-7" >
            <Image source={require("../../assets/field.jpg")}
                style={{width: 350, height: 500}} />
        </View>
 


                <TouchableOpacity  style={styles.posstiongk}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">GK</Text>
                </TouchableOpacity>
                


                <TouchableOpacity style={styles.posstionLb}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">LB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionRb}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">RB</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.posstionCb1}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCb2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>
                   

                <TouchableOpacity style={styles.posstionCm1}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCm2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">CM</Text>
                </TouchableOpacity>
               


                <TouchableOpacity style={styles.posstionCm3}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionLw}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">LW</Text>
                </TouchableOpacity>
 

                <TouchableOpacity style={styles.posstionRw}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">RW</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionSt}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">ST</Text>
                </TouchableOpacity>


                </View>

        </View>

  );
};






const styles = StyleSheet.create({
  posstionLb: {
    bottom:160,
    left:60,
    width:40,
    height:40,
    
  },
  posstiongk: {
    bottom:15,
    width:40,
    height:40,
    
    alignSelf:'center'
  },
  posstionRb: {
    bottom:170,
    left:314,
    width:40,
    height:40,
   
  },
  posstionCb1: {
    bottom:134,
    left:245,
    width:40,
    height:40,
    
  },
  posstionCb2: {
    bottom:150,
    left:130,
    width:40,
    height:40,
  
  },
  posstionCm1: {
    bottom:280,
    alignSelf:'center',
    width:40,
    height:40,
   
  },
  posstionCm2: {
    bottom:355,
    width:40,
    left:110,
    height:40,
   
    
  },
  posstionCm3: {
    bottom:370,
    left:263,
    width:40,
    height:40,
    
  },
  posstionLw: {
    bottom:475,
    left:60,
    width:40,
    height:40,
    
  },
  posstionRw: {
    bottom:490,
    left:310,
    width:40,
    height:40,
 
  },
  posstionSt: {
    bottom:565,
    width:40,
    height:40,
   
    alignSelf:'center',
  },
});









//coach/coachformation


import React from "react";
import { View, Text,TouchableOpacity,Image,StyleSheet } from "react-native"
import { StatusBar } from "react-native";

export const Formation = ({ navigation }) => {
  return (
    
    <View className="flex-1" style={{backgroundColor: "#00B365"}}>
    <View className="flex-1 flex justify-around my-5">


        <View className="flex-row justify-center top-7" >
            <Image source={require("../../assets/field.jpg")}
                style={{width: 350, height: 500}} />
        </View>
 


                <TouchableOpacity  style={styles.posstiongk}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">GK</Text>
                </TouchableOpacity>
                


                <TouchableOpacity style={styles.posstionLb}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">LB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionRb}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">RB</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.posstionCb1}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCb2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>
                   

                <TouchableOpacity style={styles.posstionCm1}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCm2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">CM</Text>
                </TouchableOpacity>
               


                <TouchableOpacity style={styles.posstionCm3}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionLw}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">LW</Text>
                </TouchableOpacity>
 

                <TouchableOpacity style={styles.posstionRw}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">RW</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionSt}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">ST</Text>
                </TouchableOpacity>


                </View>

        </View>

  );
};






const styles = StyleSheet.create({
  posstionLb: {
    bottom:160,
    left:60,
    width:40,
    height:40,
    
  },
  posstiongk: {
    bottom:15,
    width:40,
    height:40,
    
    alignSelf:'center'
  },
  posstionRb: {
    bottom:170,
    left:314,
    width:40,
    height:40,
   
  },
  posstionCb1: {
    bottom:134,
    left:245,
    width:40,
    height:40,
    
  },
  posstionCb2: {
    bottom:150,
    left:130,
    width:40,
    height:40,
  
  },
  posstionCm1: {
    bottom:280,
    alignSelf:'center',
    width:40,
    height:40,
   
  },
  posstionCm2: {
    bottom:355,
    width:40,
    left:110,
    height:40,
   
    
  },
  posstionCm3: {
    bottom:370,
    left:263,
    width:40,
    height:40,
    
  },
  posstionLw: {
    bottom:475,
    left:60,
    width:40,
    height:40,
    
  },
  posstionRw: {
    bottom:490,
    left:310,
    width:40,
    height:40,
 
  },
  posstionSt: {
    bottom:565,
    width:40,
    height:40,
   
    alignSelf:'center',
  },
});







//coach/coahnoti

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
  getDocs,getDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,onSnapshot,
  where,arrayUnion, setDoc
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const CoachNotification = ({ navigation }) => {
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






  const deleteInvite = async (inviteId) => {
    await deleteDoc(doc(db, "invitations", inviteId));
    console.log("Deleted Successfully");
  };

  const handleInvite = async (text, inviteId, playerUid,coachUid) => {
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
        const imageURL=playerDoc.data().profileImage
          const fullName=playerDoc.data().fullName
          const age=playerDoc.data().age
          const height=playerDoc.data().height;
          const weight=playerDoc.data().weight
          const level=playerDoc.data().level
          const position=playerDoc.data().position
         
        
        
          

      
      const coachDoc = await getDoc(coachRef);
      const clubName=coachDoc.data().clubName
      const description=coachDoc.data().description
      const city=coachDoc.data().city
      if(clubName==""){
        console.log("clubname empty")
      }

    

        await updateDoc(doc(db, "clubs",clubName), {
          members: arrayUnion({ 
            fullName: fullName, age: age, height:height, weight:weight,level:level,profileImage:imageURL,position:position
           }),
           clubName:clubName,description:description,city:city
        });
        console.log("Member added")
        //here I let the player join in the team so i can use it with queries 
        await updateDoc(playerRef, {
          clubName:clubName
        });
        


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
      <View style={{height:140,backgroundColor: "#f0f0f0", borderRadius: 16, marginBottom: 16 }}>


        <View  style={styles.pico} >
        <Avatar.Image size={90} source={{ uri: item.senderImage }} />
        </View>
        
        <Text>{item.massage}</Text>

          <TouchableOpacity
               onPress={() => handleInvite("Accepted", item.id, item.senderUid, item.receiverUid)}
                className="py-3 bg-green-500 self-end	bottom-20 right-2  w-28 rounded-xl">
                    <Text className=" text-center text-white">Accept</Text>
            </TouchableOpacity>
           

            <TouchableOpacity
              onPress={() => handleInvite("Rejected", item.id, item.senderUid)}
                className="py-3 bg-red-500 w-28 self-end right-2 bottom-20  mt-2	rounded-xl">
                    <Text className="text-  text-center text-white">Reject</Text>
            </TouchableOpacity>



       
      </View>
    );
  };

  return (
    <View className="flex-1 " style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-start"></View>

      <View
       
        className="flex-1 top-3 px-5 pt-7"
      >
        <FlatList data={data} renderItem={render} />

        <View className="bg-white my-9"></View>
      </View>
    </View>
  );
};



        <Button
          title="Accept"
          color={"green"}
          onPress={() => handleInvite("Accepted", item.id, item.senderUid, item.receiverUid)}
        />



        <Button className="py-3 bg-grey-400 mx-7 rounded-xl"
          title="Reject"
          color={"red"}
          onPress={() => handleInvite("Rejected", item.id, item.senderUid)}
        />





const styles = StyleSheet.create({
    pico: {
   top:25,
    paddingLeft:18,
     
    },
    
    });
  
  




*/