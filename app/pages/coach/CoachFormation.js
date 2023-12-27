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
      <View className=""

      >
            <ImageBackground   source={require("../../assets/shir.png")} 
          style={{width: 140, height: 120}}> 
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CoachFormationstack", {
              screen: "CoachVisitProfile",
              params: { itemId: item.uid },
            })
          }
        >
          
        


        <View style={styles.container}>
      <Text style={styles.fullName}>{item.fullName}</Text>
      <Text style={styles.position}>{item.position}</Text>
      
    </View>

    </TouchableOpacity>





         {/* <TouchableOpacity onPress={() => deletePlayer(item.uid)}> 
           <Text  className="font-bold top-5 text-gre self-center">Delete</Text> 
        </TouchableOpacity>  */}
        </ImageBackground>



        
      </View>
    );
  };




  return (
    <View className="flex-1" style={{backgroundColor: "#00B365"}}>
    <View className="flex-1 ">


        <View className=" self-center top-6" >
            <Image source={require("../../assets/FF2.png")}
                style={{width: 340, height: 480}} />
        </View>
      </View>

    



      <View>
      <TouchableOpacity  style={styles.posstionSt}> 
<Text className=" self-center  font-bold" style={{top:"105%"}}>player11</Text>
</TouchableOpacity>


      <TouchableOpacity  style={styles.posstionRw}> 
<Text className=" self-center  font-bold" style={{top:"95%"}}>player10</Text>
</TouchableOpacity>




      <TouchableOpacity  style={styles.posstionLw}> 
<Text className=" self-center  font-bold" style={{top:"95%"}}>player9</Text>
</TouchableOpacity>




      <TouchableOpacity  style={styles.posstionCm3}> 
<Text className=" self-center  font-bold" style={{top:"95%"}}>player8</Text>
</TouchableOpacity>

      <TouchableOpacity  style={styles.posstionCm2}> 
<Text className=" self-center  font-bold" style={{top:"95%"}}>player7</Text>
</TouchableOpacity>



      <TouchableOpacity  style={styles.posstionCm1}> 
<Text className=" self-center  font-bold" style={{top:"85%"}}>player6</Text>
</TouchableOpacity>


      <TouchableOpacity  style={styles.posstionRb}> 
<Text className=" self-center  font-bold" style={{top:"90%"}}>player5</Text>
</TouchableOpacity>


      <TouchableOpacity  style={styles.posstionLb}> 
<Text className=" self-center  font-bold" style={{top:"90%"}}>player4</Text>
</TouchableOpacity>



<TouchableOpacity  style={styles.posstionCb2}> 
<Text className=" self-center  font-bold" style={{top:"80%"}}>player3</Text>
</TouchableOpacity>

<TouchableOpacity  style={styles.posstionCb1}> 
<Text className=" self-center  font-bold" style={{top:"79%"}}>player2</Text>
</TouchableOpacity>

<TouchableOpacity  style={styles.posstiongk}> 
<Text className=" self-center  font-bold" style={{top:"80%"}}>player1</Text>
</TouchableOpacity>
</View>









              <TouchableOpacity style={{bottom:"20%"}}
              onPress={() => navigation.navigate("CoachFormationAdd")}
              className="bg-yellow-400 w-28 self-end p-2 rounded-t-2xl rounded-b-2xl ml-2"
            >

              <Text className="self-center  font-bold">Add player</Text>
            </TouchableOpacity>
            
            













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

  
    container: {
           
      bottom:"18%"    // 5% of the screen height margin from the top
    },
    fullName: {
      fontSize: 15,          // Example font size
      fontWeight: 'bold',
      top:"44%",
      marginBottom: '2%', 
      alignSelf:"center"   // 2% of the screen height margin at the bottom
    },
    position: {
      fontSize: 35,  
              // Example font size
      fontWeight: 'bold',
      marginTop: '2%',  
      top:"40%",
      alignSelf:"center"     // 2% of the screen height margin at the top
    },
  
  posstionLb: {
    width:70,
    left:"13%",
    bottom:'20%',
    height:60,
    
    
  },
  posstiongk: {
    width:70,
    right:"1%",
    bottom:'25%',
    height:60,
     
    alignSelf:'center'
  },
  posstionRb: {
    width:70,
    left:"69%",
    bottom:'11%',
    height:60,
   
   
  },
  posstionCb1: {
    width:70,
    right:"14%",
    height:60,
   
    bottom:"28%",
    alignSelf:'center'
  },
  posstionCb2: {
    width:70,
    left:"13%",
    height:60,
    
    bottom:"19%",
    alignSelf:'center'
  
  },
  posstionCm1: {
    width:70,
    right:"1%",
    bottom:'10%',
    height:60,
    
      alignSelf:'center'
  },
  posstionCm2: {
    width:70,
    left:"20%",
    bottom:'8%',
    height:60,
    
   
    
  },
  posstionCm3: {
    width:70,
    left:"62%",
    top:'1%',
    height:60,
   
    
  },
  posstionLw: {
    width:70,
    left:"14%",
    bottom:'7%',
    height:60,
   
    
  },
  posstionRw: {
    width:70,
    left:"66%",
    top:'2%',
    height:60,
    
 
  },
  posstionSt: {
    width:70,
    right:"1%",
    top:'4%',
    height:60,
    
   
    alignSelf:'center',
  },
});
