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
  RefreshControl,
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
            navigation.navigate("CoachFormationstack", {
              screen: "CoachVisitProfile",
              params: { itemId: item.uid },
            })
          }
        >
          <Avatar.Image size={100} source={{ uri: item.profileImage }} />
        </TouchableOpacity>
        <Text>{item.fullName}</Text>
        <TouchableOpacity onPress={() => deletePlayer(item.uid)}>
          <Text>Delete</Text>
        </TouchableOpacity>
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
              onPress={() => navigation.navigate("CoachFormationAdd")}
              className="bg-yellow-400  p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <Text>Add Player</Text>
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

        <TouchableOpacity style={styles.posstionLb} className="items-start">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold left-3 text-black">LB</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionRb} className="items-end">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold right-2 text-black">RB</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionCb1} className="items-center">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold  text-black">CB</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionCb2} className="items-center">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold  text-black">CB</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionCm1} className="items-start">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold left-2 text-black">CM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionCm2} className="items-center">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold text-black">CM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionCm3} className="items-end">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold right-2 text-black">CM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionLw} className="items-start">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold left-2 text-black">LW</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionRw} className="items-end">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold right-2 text-black">RW</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.posstionSt} className="items-center">
          <Image
            source={require("../../assets/player.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="font-bold text-black">ST</Text>
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
  posstionLb: {
    bottom: 160,
    left: 60,
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
