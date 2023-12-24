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
  ScrollView,
  FlatList,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from "react-native-paper";
import { useAuthentication } from "../../useAuthentication";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db, auth, firebase } from "../../component/config/config";

export const CreateTournament = ({ navigation }) => {
  const [city, setCity] = useState(null);

  const [tournamentName, setTournamentName] = useState("");
  const [prize, setPrize] = useState(null);
  const [teams, setTeams] = useState(
    Array.from({ length: 16 }, (_, index) => ({
      name: `Team ${index + 1}`,
      players: [],
    }))
  );

  const createData = () => {
    try {
      setDoc(doc(db, "tournament", tournamentName), {
        tournamentOwnerUid:auth.currentUser.uid,
        tournamentName: tournamentName,
        teams:teams,
        prize: prize,
        city: city,
      });


      updateDoc(doc(db, "users", auth.currentUser.uid), {
        tournamentName: tournamentName,

      });
      console.log("created Tournament Successfully");
      navigation.navigate("TournamentProfile");
    } catch (error) {
      console.log("Error creating data:", error);
      // Handle the error, you might want to show an alert or take other actions
    }
  };

  useEffect(() => {}, []); // The empty dependency array ensures this effect runs only once when the component mounts

  return (
    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white top-14 px-8 pt-8"
      >
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View className="form space-y-2">
            <Text className="text-gray-700 top-1  ml-4">Tournament Name</Text>
            <TextInput
              className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl "
              placeholder="Alnahdi league"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setTournamentName(text)}
              value={tournamentName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">Age</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="180000$"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setPrize(text)}
              value={prize}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">City</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="Dammam"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setCity(text)}
              value={city}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => createData()}
              className="py-3 bg-yellow-400 top-9 rounded-xl"
            >
              <Text className="text-xl  font-bold  text-center text-gray-700">
                Create Tournament
              </Text>
            </TouchableOpacity>
            <View className="bg-white my-9"></View>
            <View className="bg-white my-9"></View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
  },
  title: {},
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  inputRadio: {
    height: 70,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#788eec",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16,
  },
  loading: {
    zIndex: 9,
    position: "absolute",
    top: "50%",
    left: "50%",
    margin: -25,
  },
});
