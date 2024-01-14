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
  addDoc,
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const TournamentShowTeams = ({ navigation }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    const tournamentOrganizerRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribeOrganizer = onSnapshot(
      tournamentOrganizerRef,
      (organizerDoc) => {
        if (organizerDoc.exists()) {
          const tournamentName = organizerDoc.data().tournament;

          if (tournamentName) {
            getDocs(collection(db, "users")).then((docSnap) => {
              let items = [];
              docSnap.forEach((doc) => {
                const dataa = doc.data();
                if (dataa.role == "Coach") {
                  if (dataa.tournament == tournamentName) {
                    items.push({ ...doc.data(), id: doc.id });
                  }
                }
              });
              setData(items);
            });
          }
        }
      }
    );
  };

  const render = ({ item }) => {
    return (
      <View style={styles.hi}>
        {/* NEW navigate through stack (: */}

        <View style={styles.pico}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PlayerProfile", {
                screen: "PlayerVisitProfile",
                params: { itemId: item.id },
              })
            }
          >
            <Avatar.Image
              backgroundColor="grey"
              size={75}
              source={{ uri: item.profileImage }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.text1} className="font-bold  ">
          {item.clubName}
        </Text>
        <Text style={styles.text2}>
          Team coach:{" "}
          <Text style={{ fontWeight: "bold" }}>{item.fullName}</Text>
        </Text>

        <Text style={styles.text3} className="mb-3">
          {item.description}
        </Text>

        <View style={styles.button1}></View>
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
      <Text>Teams joined the tournament</Text>
        <FlatList
          data={data}
          renderItem={render}
          keyExtractor={(item) => item.clubName}
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
