import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from 'react-native-paper';
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth, } from "../../component/config/config";
import { Video, ResizeMode } from 'expo-av';

export const PlayerProfile = ({ navigation }) => {
  const { user, handleSignOut } = useAuthentication();
  const [imageURL, setImageURL] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState(""); //Player OR Scout or ..
  const [height, setHeight] = useState(null);
  const [clubName, setClubName] = useState(null);
  const [weight, setWeight] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);
  const [video, setVideo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  useEffect(() => {


    // Listen for changes in the Firestore document
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      setFullName(doc.data().fullName);
      setAge(doc.data().age);
      setRole(doc.data().role);
      setPhoneNumber(doc.data().phoneNumber);
      setClubName(doc.data().clubName)
      setHeight(doc.data().height);
      setWeight(doc.data().weight);
      setPosition(doc.data().position);
      setLevel(doc.data().level);
      setImageURL(doc.data().profileImage)
      setVideo(doc.data().profileVideo)
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>

      <View className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.navigate("PlayerEdit")}
            className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <Text>Edit</Text>
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

            <Text className="text-gray-700 top-1  ml-4">Age</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {age}</Text>

            <Text className="text-gray-700 top-1  ml-4">Height</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {height}</Text>

            <Text className="text-gray-700 top-1  ml-4">Weight</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {weight}</Text>

            <Text className="text-gray-700 top-1  ml-4">Phone Number</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {phoneNumber}</Text>

            <Text className="text-gray-700 top-1  ml-4">Club Name</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {clubName}</Text>

            <Text className="text-gray-700 top-1  ml-4">Postion</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {position}</Text>

            <Text className="text-gray-700 top-1  ml-4">Role</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {role}</Text>

            <Text className="text-gray-700 top-1  ml-4">Level</Text>
            <Text className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl " > {level}</Text>

            <Text className="text-gray-700 top-1   ml-4">Video</Text>
            <Video className="left-6 top-3"
              ref={videoRef}
              source={{ uri: video }}
              style={{ width: 300, height: 180, borderRadius: 25 }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />

<TouchableOpacity
              onPress={() => handleSignOut()}
              className="py-3 bg-yellow-400 top-9 rounded-xl"
            >
              <Text className="text-xl  font-bold  text-center text-gray-700">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
         
          <View className="bg-white my-9"></View><View className="bg-white my-4"></View>
        </KeyboardAwareScrollView>

      </View>

    </View>
  );
};
