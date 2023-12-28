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
  addDoc, getDoc
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";

export const AddplayerToformation = ({route, navigation }) => {
  const {index} =route.params
  
  return (

    <View className="p-4 bg-gray-100 top-1 text-gray-700 flex-row rounded-2xl ">
      <TouchableOpacity style={styles.button1}
        onPress={() => navigation.navigate("AddingPlayersManualy",{index})}
        className="py-3  self-end	 right-2  w-28 rounded-xl">
        <Text className=" text-center text-clack">Add From the team Mnaualy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button1}
        onPress={() => handleInvite("Recomended Players")}
        className="py-3  self-end	 right-2  w-28 rounded-xl">
        <Text className=" text-center text-black">Recomended Players</Text>
      </TouchableOpacity>   
    </View>
  );
    
};

const styles = StyleSheet.create({

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

posstionLb: {
  bottom:'29%',
  left:60,
  width:40,
  height:40,
  
},
posstiongk: {
  
  width:40,
  height:40,
  
  alignSelf:'center'
},
posstionRb: {
  bottom:140,
  left:314,
  width:40,
  height:40,
 
},
posstionCb1: {
  bottom:90,
  left:245,
  width:40,
  height:40,
  
},
posstionCb2: {
  bottom:94,
  left:130,
  width:40,
  height:40,

},
posstionCm1: {
  bottom:'40%',
  alignSelf:'center',
  width:40,
  height:40,
 
},
posstionCm2: {
  bottom:255,
  width:40,
  left:110,
  height:40,
 
  
},
posstionCm3: {
  bottom:259,
  left:263,
  width:40,
  height:40,
  
},
posstionLw: {
  bottom:345,
  left:65,
  width:40,
  height:40,
  
},
posstionRw: {
  bottom:348,
  left:310,
  width:40,
  height:40,

},
posstionSt: {
  bottom:375,
  width:40,
  height:40,
 
  alignSelf:'center',
},
});
