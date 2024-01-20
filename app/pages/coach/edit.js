import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,

} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from 'react-native-paper';
import {SelectList,  }from 'react-native-dropdown-select-list'
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot ,updateDoc} from "firebase/firestore";
import { db,auth, } from "../../component/config/config";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const CoachEdit = ({ navigation }) => {
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
      if (imageuri){
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
      var storagePath = 'coach/image/'+ filename;

      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', (snapshot) => {
        // progrss function ....
      }, 
      (error) => { 
        // error function ....
        console.log(error);
      }, 
      () => {
        // complete function ....
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          updateDoc(doc(db, "users", auth.currentUser.uid), {
            profileImage:downloadURL});
          
        });})
    }
      setUploading(false);
      
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };



  





  

  // THE data retrived is below ##################################################
  const { user, handleSignOut } = useAuthentication();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  
  const [level, setLevel] = useState(null);
  const [selected, setSelected] = React.useState("");



  const data = [
    {key:'Beginner', value:'Beginner'},
    {key:'Intermediate', value:'Intermediate'},
    {key:'expert', value:'expert'},
  ]


  useEffect(() => {
 
   

    // Get the document
   
    // Listen for changes in the Firestore document
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      
      setFullName(doc.data().fullName || "");
      setAge(doc.data().age || "");
      setLevel(doc.data().level || "");
      setImage(doc.data().profileImage || "");
      setPhoneNumber(doc.data().phoneNumber || "")
    
  });

 

    

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const updateData =  () => {
    uploadPhoto()//to upload the photo
  
    updateDoc(doc(db, "users", auth.currentUser.uid), {
         fullName: fullName, age: age, phoneNumber:phoneNumber,level:level,});
         
    console.log("Updated Successfully");
     navigation.navigate('CoachProfile')
  };

 
  return (


    <View className="flex-1"  style={{backgroundColor: "#00B365"}}>


     <View  className="flex ">

      
      <View className="flex-row justify-start">
        <TouchableOpacity onPress={()=> navigation.goBack()} 
        className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
       </View>



      <View className="flex-row top-9 justify-center ">
          <TouchableOpacity onPress={() => pickImage()} >
          <Avatar.Image backgroundColor="grey"
            size={150} 
              source={({uri : imageuri})}
              
            />
              
          <Text style={{color:"white",textAlign:"center",top:9}}>Insert image</Text>
           </TouchableOpacity>

           
      </View>
      
    </View>


  

    <View style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
      className="flex-1 bg-white top-14 px-8 pt-8">
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

        <Text className="text-gray-700 top-1 ml-4">Phone Number</Text>
        <TextInput
          className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
          placeholder="055748322"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />


         <View className="text-gray-700 top-2">

         <Text className="text-gray-700  ml-4">Select level</Text>
  <View className=" my-1"></View>
        <SelectList 
        setSelected={(val) =>  setLevel(val)} 
        data={data} 
        save="value"
          />

          
           
        </View>


          <TouchableOpacity  onPress={() => updateData()} 
          
            className="py-3 bg-yellow-400 top-9 rounded-xl">
              <Text  className="text-xl  font-bold  text-center text-gray-700" >Save profile</Text>
           </TouchableOpacity>
           <View className="bg-white my-9"></View>
           <View className="bg-white my-9"></View>
  
           </View>
           </KeyboardAwareScrollView>

        </View>
       
        
        
    </View>
 


  );
};




