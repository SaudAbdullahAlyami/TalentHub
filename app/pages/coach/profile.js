import React, { useState,useEffect } from "react";
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
  FlatList
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from 'react-native-paper';
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot,collection,setDoc,getDocs } from "firebase/firestore";
import { db ,auth,firebase } from "../../component/config/config";
import { Video, ResizeMode } from 'expo-av';

export const CoachProfile = ({ navigation }) => {
  const { user, handleSignOut } = useAuthentication();
  const [imageURL, setImageURL] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState(""); //Player OR Scout or ..
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);
  const [video, setVideo] = useState(null);
  const [status, setStatus] = React.useState({});
  const [videoRef, setVideoRef] = useState(null);
  useEffect(() => {
 

    // Listen for changes in the Firestore document
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      setFullName(doc.data().fullName);
      setAge(doc.data().age);
      setRole(doc.data().role);
      setHeight(doc.data().height);
      setWeight(doc.data().weight);
      setLevel(doc.data().level);
      setImageURL(doc.data().profileImage)
      setVideo(doc.data().profileVideo)
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);


  const [data, setData] = useState([]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "users")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        // const data = doc.data();
        // if (data.age < 1000) {
        //   filteredStudents.push({ id: doc.id, ...data });

        items.push({ ...doc.data(), id: doc.id });
      });
      setData(items);
    });
  };


  



  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
   
        <View className="flex ">
          <View className="flex-row justify-start">
            <TouchableOpacity
              onPress={() => navigation.navigate("CoachEdit")}
              className="bg-yellow-400 top-5 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>
            
          <View className="flex-row justify-center">
            
            <Avatar.Image backgroundColor="grey"
            size={150} 
              source={({uri : imageURL})}
              
            />
          </View>
        </View>
        <ScrollView>
        <View style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
        
      className="flex-1 bg-white top-8 px-8 pt-8">
        <View className="form space-y-2">
        <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>User ID: {item.fullName}</Text>
            <Text>User Name: {item.age}</Text>
          </View>
        )}
        
      />


<Text className="text-gray-700 top-1  ml-4">Full Name</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {fullName}</Text>



<Text className="text-gray-700 top-1  ml-4">Age</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {age}</Text>


 
<Text className="text-gray-700 top-1  ml-4">Role</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {role}</Text>


<Text className="text-gray-700 top-1  ml-4">Height</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {height}</Text>


<Text className="text-gray-700 top-1  ml-4">Weight</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {weight}</Text>


<Text className="text-gray-700 top-1  ml-4">Level</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {level}</Text>

<Text className="text-gray-700 top-1  ml-4">Video</Text>
<Video
                ref={videoRef}
                source={{ uri:video}}
                style={{ width: 300, height: 180 ,borderRadius:25}}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                />
</View>
        <TouchableOpacity
          className="py-3 bg-yellow-400 top-9 rounded-xl"
          onPress={() => onRegisterPress()}
        >
          <Text  className="text-xl  font-bold  text-center text-gray-700">Create account</Text>
        </TouchableOpacity> 
        <View className="bg-white my-9"></View>
        
        </View>
     </ScrollView>
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
