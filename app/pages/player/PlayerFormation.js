import React, { useState, useEffect ,useCallback} from "react";
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
  FlatList, ImageBackground,RefreshControl
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  doc,
  getDocs,
  collection,
  query,
  updateDoc, getDoc,
  deleteDoc, onSnapshot,
  where, arrayUnion
  , deleteField, arrayRemove
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const PlayerFormation = ({ navigation }) => {
  const [members, setMembers] = useState([])
  const [clubName, setclubName] = useState("")


  useEffect(() => {
    fetchData();

    // Clean up the subscription when the component unmounts
    return () => {
      /* Cleanup logic if needed */
    };
  }, []);

  const fetchData = async (navigation) => {
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
      console.error("Error fetching data:", error);
    }
  };

  const leaveTeam = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      if (userClubName) {
        const memberIdToRemove = auth.currentUser.uid; // Assuming you want to remove the current user
        const clubRef = doc(db, "clubs", userClubName);

        // Get the current members array
        const clubDoc = await getDoc(clubRef);
        const currentMembers = clubDoc.data().members;

        // Remove the specified member from the array
        const updatedMembers = currentMembers.filter(member => member.uid !== memberIdToRemove);

        // Update the club document with the new members array
        await updateDoc(clubRef, {
          members: updatedMembers
        });
        console.log("Player was deleted")
        fetchData();
        //Update the user document to remove the clubName
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          clubName: ""
        });
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
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
        <ImageBackground source={require("../../assets/bk1.png")}
          style={{ width: 110, height: 160 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PlayerFormationstack", {
                screen: "PlayerVisitProfile",
                params: { itemId: item.uid },
              })
            }
          >
            <Avatar.Image className="self-center top-2" size={70} source={{ uri: item.profileImage }} />
          </TouchableOpacity>

          <View style={styles.container}>
            <Text style={styles.fullName}>{item.fullName}</Text>
            <Text style={styles.position}>{item.position}</Text>
          </View>
          
        </ImageBackground>
      </View>
    );
  };

  

  return (
    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-1 flex justify-around my-5">
        <View className="flex-row justify-center top-3">
          <Image
            source={require("../../assets/field.jpg")}
            style={{ width: 350, height: 500 }}
          />
        </View>

        <View className="flex ">
          <View className="flex-row justify-end top-9">


            <TouchableOpacity
              onPress={() => leaveTeam(navigation)}
              className="bg-yellow-400  p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <Text>Leave Team</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.posstiongk}
          className="items-center	bottom-9 "
        >
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold text-black">GK</Text>
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
      
      {/* <View style={styles.container}>
        <FlatList data={members} renderItem={render} horizontal />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  posstionLb: {
    bottom: 160,
    left: 60,
  },
  container: {
    alignItems: 'center', // Center items horizontally
    marginTop: '5%',      // 5% of the screen height margin from the top
  },
  fullName: {
    fontSize: 16,          // Example font size
    fontWeight: 'bold',
    marginBottom: '2%',    // 2% of the screen height margin at the bottom
  },
  position: {
    fontSize: 14,          // Example font size
    fontWeight: 'bold',
    marginTop: '2%',       // 2% of the screen height margin at the top
  },
  posstiongk: {
    bottom: 15,
  },
  posstionRb: {
    bottom: 180,
    right: 60,
  },
  posstionCb1: {
    bottom: 160,
    right: 60,
  },
  posstionCb2: {
    bottom: 180,
    left: 60,
  },
  posstionCm1: {
    bottom: 357,
    left: 113,
  },
  posstionCm2: {
    bottom: 320,
  },
  posstionCm3: {
    bottom: 400,
    right: 110,
  },
  posstionLw: {
    bottom: 520,
    left: 60,
  },
  posstionRw: {
    bottom: 540,
    right: 60,
  },
  posstionSt: {
    bottom: 630,
  },
});
