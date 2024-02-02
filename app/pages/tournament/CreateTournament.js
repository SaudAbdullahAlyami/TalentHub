import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../component/config/config";

export const CreateTournament = ({ navigation }) => {
  const [city, setCity] = useState(null);
  const [tournamentName, setTournamentName] = useState("");
  const [description, setDescription] = useState("");
  const [prize, setPrize] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [teams, setTeams] = useState(
    Array.from({ length: 16 }, (_, index) => ({
      name: `Team ${index + 1}`,
      players: [],
      teamImage: null,
    }))
  );
  const [matchs, setmatchs] = useState([]);

  const createData = async () => {
    try {
      const organizerDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const image = organizerDoc.data().profileImage;
      setDoc(doc(db, "tournament", tournamentName), {
        tournamentOwnerUid: auth.currentUser.uid,
        tournamentImage: image,
        tournamentName: tournamentName,
        teams: teams,
        prize: prize,
        city: city,
        description: description,
        teamsArrayIndex: 0,
        startDate: startDate,
        endDate: endDate,
        isFinished: false,
        //creating empty matchs
        matchs: matchs,
        matchsRound2: matchs,
        matchsRound3: matchs,
        matchsRound4: matchs,
      });

      updateDoc(doc(db, "users", auth.currentUser.uid), {
        tournament: tournamentName,
      });

      console.log("Created Tournament Successfully");
      navigation.navigate("TournamentProfile");
    } catch (error) {
      console.log("Error creating data:", error);
      // Handle the error, you might want to show an alert or take other actions
    }
  };

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

            <Text className="text-gray-700 top-1 ml-4">Prize</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="180000$"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setPrize(text)}
              value={prize}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">Location</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="Dammam"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setCity(text)}
              value={city}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">Description</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="vnsdivns vidsojvno"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setDescription(text)}
              value={description}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">Start Date</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="2024/2/11"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setStartDate(text)}
              value={startDate}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />


            <Text className="text-gray-700 top-1 ml-4">End Date</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="2024/2/11"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setEndDate(text)}
              value={endDate}
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
