import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Avatar } from "react-native-paper";

import { doc, collection, getDocs, getDoc, addDoc } from "firebase/firestore";

import { db, auth, firebase } from "../../component/config/config";

export const CoachJoiningTournament = ({ navigation }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "tournament")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        const dataa = doc.data();

        items.push({ ...doc.data(), id: doc.id });
      });
      setData(items);
      setFilteredData(items);
    });
  };

  const inviteTournmant = async (TourId) => {
    try {
      if (TourId == null) {
        console.log("TourId == null");
      }

      const coachDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (
        coachDoc.data().fullName != "" ||
        coachDoc.data().profileImage != "" ||
        coachDoc.data().position != ""
      ) {
        const fullName = coachDoc.data().fullName;
        const imageURL = coachDoc.data().profileImage;

        // Create an invitation in Firestore
        const invitationRef = collection(db, "invitations");
        const newInvitationDoc = await addDoc(invitationRef, {
          senderUid: auth.currentUser.uid, // Assuming user is the coach sending the invitation
          senderName: fullName,
          senderImage: imageURL,
          receiverUid: TourId,
          status: "Pending",
          // Add any additional details you want to include in the invitation
        });
      } else {
        Alert.alert("Empty Fields", "Please fill in all required fields.");
      }
      // Notify the player about the invitation
      // You can use FCM or another notification method here
      console.log("Joining sent successfully!");
    } catch (error) {
      Alert.alert(" Update your profile", "Please fill all required fields.");
      console.log(error);
    }
  };

  const [filteredData, setFilteredData] = useState(data);

  const render = ({ item }) => {
    return (
      <View style={styles.hi}>
        {/* NEW navigate through stack (: */}

        <View style={styles.pico}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CoachJoiningTourstack", {
                screen: "CoachJoiningTourPage",
                params: { itemId: item.tournamentOwnerUid },
              });
            }}
          >
            <Avatar.Image
              backgroundColor="grey"
              size={75}
              source={{ uri: item.tournamentImage }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.text1} className="font-bold  ">
          {item.tournamentName}
        </Text>

        <Text style={styles.text3} className="mb-3">
          description:{item.description}
        </Text>

        <Text style={styles.text3} className="mb-3">
          Start Date: {item.startDate.toLocaleString()}
        </Text>

        <Text style={styles.text3} className="mb-3">
          End Date:
        </Text>

        <Text style={styles.text3} className="mb-3">
          Teams participated: {item.teamsArrayIndex} /16
        </Text>

        <Text style={styles.text3} className="mb-3">
          Prize: {item.prize}
        </Text>

        <View style={styles.button1}>
          <TouchableOpacity
            onPress={() => inviteTournmant(item.tournamentOwnerUid)}
            className="bg-yellow-400  py-3 	 w-28 rounded-xl"
          >
            <Text className=" text-center ">Ask to join</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-center top-10">
        <Image
          source={require("../../assets/teams.png")}
          style={{ width: 300, height: 150 }}
        />
      </View>

      <View
        style={{ backgroundColor: "white", paddingBottom: 10 }}
        className="flex-1 bg-white top-16"
      >
        <FlatList
          data={filteredData}
          renderItem={render}
          keyExtractor={(item) => item.tournamentName}
        />

        <View className="bg-white my-9"></View>
      </View>
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
  text3: {
    fontSize: 14,
    marginBottom: 15,
    marginTop: 5,
  },
  button1: {
    position: "absolute",
    top: 30, // Adjust the top position as needed
    right: 10, // Adjust the right position as needed

    padding: 10,
    borderRadius: 5,
  },
  hi: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,

    marginLeft: 10,
  },
  searchBar: {
    top: 60,
    width: 300,
  },
});
