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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from "react-native-paper";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth, firebase } from "../../component/config/config";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export const PlayerEdit = ({ navigation }) => {
  // here is code for photo

  const [image, setImage] = useState(null);
  const [imageuri, setImageURI] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setImageURI(result.assets[0].uri);
    }
  };

  const uploadPhoto = async () => {
    setUploading(true);

    try {
      if(imageuri){
      const { uri } = await FileSystem.getInfoAsync(imageuri);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          resolve(xhr.response);
        };

        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = imageuri.substring(imageuri.lastIndexOf("/") + 1);
      const storage = getStorage();
      var storagePath = "player/image/" + filename;

      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progrss function ....
        },
        (error) => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("Photo available at", downloadURL);
            updateDoc(doc(db, "users", auth.currentUser.uid), {
              profileImage: downloadURL,
            });
          });
        }
      );
    }
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const [video, setVideo] = useState(null);
  const pickVideo = async () => {
    ImagePicker.getMediaLibraryPermissionsAsync();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  const uploadVideo = async () => {
    setUploading(true);

    try {
      if (video){
      const { uri } = await FileSystem.getInfoAsync(video);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          resolve(xhr.response);
        };

        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = video.substring(video.lastIndexOf("/") + 1);
      const storage = getStorage();
      var storagePath2 = "player/video/" + filename;

      const storageRef = ref(storage, storagePath2);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("Video available at", downloadURL);
            updateDoc(doc(db, "users", auth.currentUser.uid), {
              profileVideo: downloadURL,
            });
          });
        }
      );
      }
      setUploading(false);
    } catch (error) {
      console.log("upload "+error);
      setUploading(false);
    }
  };

  // THE data retrived is below ##################################################
  const { user, handleSignOut } = useAuthentication();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);
  const [selected, setSelected] = React.useState("");

  const levelData = [
    { key: "Beginner", value: "Beginner" },
    { key: "Intermediate", value: "Intermediate" },
    { key: "expert", value: "expert" },
  ];

  const positionData = [
    { key: "GK", value: "GK" },
    { key: "CD", value: "CD" },
    { key: "RB", value: "RB" },
    { key: "LB", value: "LB" },
    { key: "CM", value: "CM" },
    { key: "RW", value: "RW" },
    { key: "LW", value: "LW" },
    { key: "ST", value: "ST" },
  ];

  useEffect(() => {
    // Get the document

    // Listen for changes in the Firestore document
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        setFullName(doc.data().fullName);
        setAge(doc.data().age);
        setHeight(doc.data().height);
        setWeight(doc.data().weight);
        setLevel(doc.data().level);
        setImage(doc.data().profileImage);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const updateData = () => {
    uploadPhoto(); //to upload the photo
    uploadVideo();
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      fullName: fullName,
      age: age,
      height: height,
      weight: weight,
      level: level,
      position: position,
    });

    console.log("Updated Successfully");
    navigation.navigate("Playerprofile");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
      <View className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
                 
        <View className="flex-row top-9 justify-center ">

        
          <TouchableOpacity onPress={() => pickImage()}>
            <Avatar.Image
              backgroundColor="grey"
              size={150}
              source={{ uri: imageuri }}
            />

            <Text style={{ color: "white", textAlign: "center", top: 9 }}>
              Insert image
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      
        <View
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          className="flex-1 bg-white top-14 px-8 pt-8"
        >
<KeyboardAwareScrollView 
    keyboardShouldPersistTaps="always"
  >

          <View className="form space-y-2">
            <Text className="text-gray-700 top-1  ml-4">Full Name</Text>
            <TextInput
              className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl "
              placeholder="Full Name"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">Age</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="18"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setAge(text)}
              value={age}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">height</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="180"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setHeight(text)}
              value={height}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 top-1 ml-4">Weight</Text>
            <TextInput
              className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
              placeholder="80"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setWeight(text)}
              value={weight}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

                <View className="text-gray-700  top-3">
              <Text className="text-gray-700  ml-4">Select Position</Text>

              <View className=" my-1"></View>
              <SelectList
                setSelected={(val) => setPosition(val)}
                data={positionData}
                save="value"
              />
              </View>

            <View  className="text-gray-700  top-6">
              <Text className="text-gray-700 bottom-1 ml-4">Select level</Text>
              <View className=" my-1"></View>
              <SelectList 
                
                setSelected={(val) => setLevel(val)}
                data={levelData}
                save="value"
              />


              <TouchableOpacity className="top-3 my-3 items-center	" onPress={() => pickVideo()}>
              <Image source={require("../../assets/upvideo.png")}
                style={{width: 140, height: 140}} />
                <Text style={{ color: "black", textAlign: "center", top: 20 }}>
                  Insert Video
                </Text>
              </TouchableOpacity>
            </View>
               
            <TouchableOpacity 
              onPress={() => updateData()}
              className="py-3 bg-yellow-400 top-12 rounded-xl"
            >
              <Text className="text-xl  font-bold  text-center text-gray-700">
                Save profile
              </Text>
            </TouchableOpacity>
            <View className="bg-white my-12"></View>
            <View className="bg-white my-14"></View>
          </View></KeyboardAwareScrollView>
        </View>
        
    </View>
  );
};
