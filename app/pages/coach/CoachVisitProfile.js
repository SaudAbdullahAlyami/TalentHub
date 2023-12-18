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
  
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from 'react-native-paper';
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot,getDoc } from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db ,auth,firebase } from "../../component/config/config";
import { Video, ResizeMode } from 'expo-av';

export const CoachVisitProfile = ({ route,navigation  }) => {
    const { itemId } = route.params;
    


  const { user, handleSignOut } = useAuthentication();
  const [imageURL, setImageURL] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState(""); //Player OR Scout or ..
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);
  const [video, setVideo] = useState(null);
  const [status, setStatus] = React.useState({});
  const [videoRef, setVideoRef] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", itemId));
        const userData = userDoc.data();
        if (userData) {
          setFullName(userData.fullName);
          setAge(userData.age);
          setRole(userData.role);
          setHeight(userData.height);
          setWeight(userData.weight);
          setPosition(userData.position);
          setLevel(userData.level);
          setImageURL(userData.profileImage);
          setVideo(userData.profileVideo);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [itemId]);





  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
  
        <View className="flex ">
          <View className="flex-row justify-start">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <ArrowLeftIcon size="20" color="black"/>
            </TouchableOpacity>
          </View>
         
          <View className="flex-row top-9 justify-center">
            
            <Avatar.Image backgroundColor="grey"
            size={150} 
              source={({uri : imageURL})}
              
            />
          </View>
        </View>
        
        <View style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
        
      className="flex-1 bg-white top-14 px-8 pt-8">

<KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
      >
        <View className="form space-y-2">



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

<Text className="text-gray-700 top-1  ml-4">Postion</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {position}</Text>


<Text className="text-gray-700 top-1  ml-4">Level</Text>
<Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {level}</Text>

<Text className="text-gray-700 top-1   ml-4">Video</Text>
{video ? 
    <Video className="left-6 top-3"
                ref={videoRef}
                source={{ uri:video}}
                style={{ width: 300, height: 180 ,borderRadius:25}}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                />
                : null}
</View>
        <TouchableOpacity
          className="py-3 bg-yellow-400 top-9 rounded-xl"
          onPress={() => onRegisterPress()}
        >
          <Text  className="text-xl  font-bold  text-center text-gray-700">Create account</Text>
        </TouchableOpacity> 
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
