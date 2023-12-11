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
  query,
  where
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const PlayerNotification = ({ navigation }) => {
   const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    try {
      const invitationsRef = collection(db, "invitations");
      const q = query(invitationsRef, where("receiverUid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
  
      const invitations = [];
      querySnapshot.forEach((doc) => {
        invitations.push({ id: doc.id, ...doc.data() });
      });
  
      setData(invitations)
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };




  const render = ({ item }) => {
    return (
      <View className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl ">
        
        <Text>sender is:{item.senderUid}</Text>
        <Button title="Accept" color={"green"}/>
        <Button title="Rejact" color={"red"}/>
        
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-start">
        
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
/*


<View style={styles.playerCard}>
        
        <Image source={{uri: item.profileImage }} style={styles.playerImage} />
        <Text style={styles.playerName}>{item.name}</Text>
        <Text>sender is:{item.senderUid}</Text>
       
      </View>


<View style={styles.container}>
        <FlatList data={data}
         renderItem={render}




const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  playerCard: {
    width: 120,
    height: 180,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 8,
    overflow: 'hidden',
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  playerImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  playerName: {
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});



*/