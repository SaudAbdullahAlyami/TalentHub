import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from 'react-native-paper';
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth, } from "../../component/config/config";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

export const TournamentVisitProfile = ({ route,navigation  }) => {

  const { itemId } = route.params;
  const [imageURL, setImageURL] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState(""); //Player OR Scout or ..
  const [clubName, setclubName] = useState("");
  const [level, setLevel] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  useEffect(() => {

    // Listen for changes in the Firestore document
    const unsubscribe = onSnapshot(doc(db, "users", itemId), (doc) => {
      setFullName(doc.data().fullName);
      setAge(doc.data().age);
      setRole(doc.data().role);
      setPhoneNumber(doc.data().phoneNumber);
      setclubName(doc.data().clubName);
      setLevel(doc.data().level);
      setImageURL(doc.data().profileImage)
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);


  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>

      <View className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
                <View className="flex-row top-9 justify-center">

          <Avatar.Image backgroundColor="grey"
            size={150}
            source={({ uri: imageURL })}

          />
        </View>
      </View>

      <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}

        className="flex-1 bg-white top-14 px-8 pt-8">

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
        >
          <View className="form space-y-2">

            <Text className="text-gray-700 top-1  ml-4">Full Name</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {fullName}</Text>

            <Text className="text-gray-700 top-1  ml-4">Club Name</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {clubName}</Text>

            <Text className="text-gray-700 top-1  ml-4">Age</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {age}</Text>

            <Text className="text-gray-700 top-1  ml-4">Phone Number</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {phoneNumber}</Text>

            <Text className="text-gray-700 top-1  ml-4">Role</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {role}</Text>

            <Text className="text-gray-700 top-1  ml-4">Level</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {level}</Text>

          </View>
         
          <View className="bg-white my-9"></View><View className="bg-white my-4"></View>
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
