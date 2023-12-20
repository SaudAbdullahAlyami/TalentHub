import React, { useState, useEffect, useCallback } from "react";
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
  RefreshControl,ImageBackground
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  doc,
  getDocs,
  collection,
  query,
  updateDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";
export const CoachFormation = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [clubName, setclubName] = useState("");

  useEffect(() => {
    fetchData();
    // Clean up the subscription when the component unmounts
    return () => {
      /* Cleanup logic if needed */
    };
  }, []);

  const fetchData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      if (userClubName) {
        const clubDoc = await getDoc(doc(db, "clubs", userClubName));
        setMembers(clubDoc.data().members);
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const deletePlayer = async (playerUid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      if (userClubName) {
        const memberIdToRemove = playerUid;
        const clubRef = doc(db, "clubs", userClubName);

        // Get the current members array
        const clubDoc = await getDoc(clubRef);
        const currentMembers = clubDoc.data().members || []; // Ensure it's an array or default to an empty array

        // Find the index of the playerUid in the array
        const indexToRemove = currentMembers.findIndex(
          (member) => member.uid === memberIdToRemove
        );

        if (indexToRemove !== -1) {
          // Use arrayRemove to remove the specified member from the array
          await updateDoc(clubRef, {
            members: arrayRemove(currentMembers[indexToRemove]),
          });

          console.log("Player was deleted");

          // Update the user document to remove the clubName
          await updateDoc(doc(db, "users", playerUid), {
            clubName: "",
          });

          fetchData(); // Assuming fetchData is a function that fetches updated data
        } else {
          console.error("Player not found in the members array.");
        }
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, []);






  const render = ({ item }) => {
    return (
      <View className="mr-3"

      >
            <ImageBackground   source={require("../../assets/ss.png")} 
          style={{width: 100, height: 150}}> 
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CoachFormationstack", {
              screen: "CoachVisitProfile",
              params: { itemId: item.uid },
            })
          }
        >
          <Avatar.Image className="self-center top-2" size={70} source={{ uri: item.profileImage }} />
        </TouchableOpacity>
        <Text>{item.fullName}</Text>
        <TouchableOpacity onPress={() => deletePlayer(item.uid)}>
          <Text>Delete</Text>
        </TouchableOpacity></ImageBackground>
      </View>
    );
  };
  return (
    <View className="flex-1" style={{backgroundColor: "#00B365"}}>
    <View className="flex-1 flex justify-around my-5">


        <View className="flex-row justify-center top-7" >
            <Image source={require("../../assets/field.jpg")}
                style={{width: 315, height: 450}} />
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
      <View>
      <TouchableOpacity
              onPress={() => navigation.navigate("CoachFormationAdd")}
              className="bg-yellow-400 bottom-4 w-28 self-end p-2 rounded-t-2xl rounded-b-2xl ml-2"
            >

              <Text className="self-center  font-bold">Add player</Text>
            </TouchableOpacity>
            </View>

      <View style={styles.container}>
        <FlatList
          data={members}
          renderItem={render}
          horizontal
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            
          }
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({

  container:{
 

  },
  posstionLb: {
    bottom:135,
    left:60,
    width:40,
    height:40,
    
  },
  posstiongk: {
    
    width:40,
    height:40,
    
    alignSelf:'center'
  },
  posstionRb: {
    bottom:140,
    left:314,
    width:40,
    height:40,
   
  },
  posstionCb1: {
    bottom:90,
    left:245,
    width:40,
    height:40,
    
  },
  posstionCb2: {
    bottom:94,
    left:130,
    width:40,
    height:40,
  
  },
  posstionCm1: {
    bottom:180,
    alignSelf:'center',
    width:40,
    height:40,
   
  },
  posstionCm2: {
    bottom:255,
    width:40,
    left:110,
    height:40,
   
    
  },
  posstionCm3: {
    bottom:259,
    left:263,
    width:40,
    height:40,
    
  },
  posstionLw: {
    bottom:345,
    left:65,
    width:40,
    height:40,
    
  },
  posstionRw: {
    bottom:348,
    left:310,
    width:40,
    height:40,
 
  },
  posstionSt: {
    bottom:375,
    width:40,
    height:40,
   
    alignSelf:'center',
  },
});
