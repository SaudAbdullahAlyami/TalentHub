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
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebase } from "../../component/config/config";

export const CoachFormationAdd = ({ navigation }) => {
  const { user, handleSignOut } = useAuthentication();
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");

  const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "users")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        const dataa = doc.data();
        if (dataa.role == "Player") {
          items.push({ ...doc.data(), uid: doc.uid });
        }
      });
      setData(items);
    });
  };


const invitePlayer=()=>{
    
}


  const render = ({ item }) => {
    return (
      <View className="p-4 bg-gray-100 top-1 text-gray-700 flex-row rounded-2xl ">
        <Avatar.Image
          backgroundColor="grey"
          size={150}
          source={{ uri: item.profileImage }}
        />
        <Text>{item.fullName}</Text>
        <TouchableOpacity
          onPress={invitePlayer()}
          className="bg-yellow-400  p-3 rounded-tr-2x1 rounded-bl-2xl ml-2"
        >
          <Text>dbbf</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-yellow-400 top-5 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white top-8 px-8 pt-8"
      >
        <FlatList data={data} renderItem={render} />

        <View className="bg-white my-9"></View>
      </View>
    </View>
  );
};
