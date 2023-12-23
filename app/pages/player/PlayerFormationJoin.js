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
  getDoc,
  addDoc,
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";


export const PlayerFormationJoin = ({ navigation }) => {

  const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
 
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "users")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        const dataa = doc.data();
        if (dataa.role == "Coach") {
          items.push({ ...doc.data(), id: doc.id });
        }

      });
      setData(items);
      setFilteredData(items);
    });
  };


 

 




const invitePlayer=async(CoachUid)=>{
    try {
        if(CoachUid==null){
            console.log("CoachUid == null")
        }
        
        const playerDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if(playerDoc.data().fullName!=""||playerDoc.data().profileImage!=""||playerDoc.data().position!=""){
        const fullName=playerDoc.data().fullName;
        const imageURL=playerDoc.data().profileImage;
        const position=playerDoc.data().position;
        
        // Create an invitation in Firestore
        const invitationRef = collection(db, "invitations",);
    const newInvitationDoc = await addDoc(invitationRef, {
      senderUid: auth.currentUser.uid, // Assuming user is the coach sending the invitation
      senderName:fullName,
      senderImage:imageURL,
      senderPosition:position,
      receiverUid: CoachUid,
      status: "Pending",
      // Add any additional details you want to include in the invitation
    });
  }else{
    Alert.alert("Empty Fields", "Please fill in all required fields.");

  }
        // Notify the player about the invitation
        // You can use FCM or another notification method here
  
        // Optional: Update UI or provide feedback to the coach
        console.log("Joining sent successfully!");
      } catch (error) {
        Alert.alert(" Update your profile", "Please fill all required fields.");
        console.log(error)
      }
}
const [filteredData, setFilteredData] = useState(data);
const [searchText, setSearchText] = useState('');

const handleSearch = (text) => {
  setSearchText(text);
  const filtered = data.filter((item) =>
    item.fullName.toLowerCase().includes(text.toLowerCase())
  );
  setFilteredData(filtered);
};

  const render = ({ item }) => {
    
    return (
      <View style={styles.hi}>


      
        {/* NEW navigate through stack (: */}

        <View  style={styles.pico}>
        <TouchableOpacity onPress={()=>navigation.navigate('PlayerProfile', { screen: 'PlayerVisitProfile' ,params: {itemId:item.id}})}>
        <Avatar.Image
          backgroundColor="grey"
          size={75}
          source={{ uri: item.profileImage }}
        />
        </TouchableOpacity>
        </View>



        <Text style={styles.text1} className="font-bold  ">{item.clubName}
        </Text>
        <Text  style={styles.text2} >Team coach: <Text style={{ fontWeight: 'bold' }}>{item.fullName}</Text></Text>

        <Text style={styles.text3} className="mb-3">{item.description}
        </Text>
           

           <View style={styles.button1}>
        <TouchableOpacity   
          onPress={()=>invitePlayer(item.id)}
          className="bg-yellow-400  py-3 	 w-28 rounded-xl"
        >
          <Text  className=" text-center ">Ask to join</Text>
        </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
     
      <View  className="flex-row justify-center top-10">
          <Image source={require("../../assets/teams.png")} 
          style={{width:300, height: 150}} />
          
        </View>
        
        
        <TextInput style={styles.searchBar}
        className="p-3 bg-gray-100 text-gray-700  w-60 self-center rounded-2xl mb-3"
        placeholder="Search for a team ..."
         underlineColorAndroid="transparent"
        autoCapitalize="none"
        value={searchText}
        onChangeText={handleSearch}
      />

<View style={{backgroundColor:"white",paddingBottom:10}} 
        className="flex-1 bg-white top-16">


        <FlatList data={filteredData} renderItem={render}  keyExtractor={(item) => item.fullName}/>

        <View className="bg-white my-9"></View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  pico: {
 top:32,
  paddingLeft:18,
 
   
  },
  text1:{
    fontSize:18,
    left:103,
    bottom:30,
    
   
  },
  text2:{
    fontSize:14,
    left:103,
    bottom:25,
  },
  text3:{
    fontSize:14,
   marginBottom:15,
   marginTop:5,
  },
  button1:{

    position: 'absolute',
    top: 30, // Adjust the top position as needed
    right: 10, // Adjust the right position as needed
  
    padding: 10,
    borderRadius: 5,
   
  },
  hi:{
    borderBottomColor: 'ddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
  
    marginLeft: 10,
   
  },
  searchBar: {
    top:60,
    width:300,
  },

  });