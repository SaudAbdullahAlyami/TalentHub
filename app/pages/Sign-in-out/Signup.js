import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../component/config/config";
import { StatusBar } from "react-native";
import { db } from "../../component/config/config";
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import {
  doc,
  setDoc,
} from "firebase/firestore";

export const SignUp = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");//Player OR Scout or ..
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clubName, setclubName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [profileImage, setProfileImage] = useState("https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg");


  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  // for coloring radiobutton


  //assign the radiobutton
  const handleRadioButtonPress = (value) => {

    setRole(value)
  };

  const onFooterLinkPress = () => {
    navigation.navigate("Sign In");
  };

  //check if the values empty
  const onRegisterPress = () => {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }
    if (value.password !== confirmPassword) {
      setValue({
        ...value,
        error: "passwords dont match",
      });
      return;
    }


    setTimeout(() => {
      createUserWithEmailAndPassword(auth, value.email, value.password)
        .then((userCredential) => {
          //ADD in db
          setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: value.email,
            fullName: fullName,
            clubName: clubName,
            description: description,
            city: city,
            role: role,
            profileImage:profileImage,
            tournament:""
          });
          console.log("The Player Was Added Successfully");

          setValue({
            ...value,
            error: null,
          });
          navigation.navigate('Sign In');
        })
        .catch((error) => {
          setValue({
            ...value,
            error: error.message,
          });
        });
    }, 300);

  };



  return (

    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <View className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={() => navigation.goBack()}
            className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>

      </View>
      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white top-16 px-8 pt-8">
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

          <Text className="text-gray-700 top-1 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 top-1 text-gray-700 rounded-2xl"
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setValue({ ...value, email: text })}
            value={value.email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />


          <Text className="text-gray-700 top-1 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 top-1 text-gray-700 rounded-2xl"
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => setValue({ ...value, password: text })}
            value={value.password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />



          <Text className="text-gray-700 top-1 ml-4">Confirm Password</Text>
          <TextInput
            className="p-4 bg-gray-100 top-1 text-gray-700 rounded-2xl"
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          {/* ffffffffffffffffffffffffffffffffffffffffffffffff */}
          {(role == "Coach"||role == "Scout") && (
             <><Text className="text-gray-700 top-3 ml-4">Club Name</Text><TextInput
              className="p-4 bg-gray-100 top-5 text-gray-700 rounded-2xl"
              placeholderTextColor="#aaaaaa"
              
              placeholder="Club Name"
              onChangeText={(text) => setclubName(text)}
              value={clubName}
              underlineColorAndroid="transparent"
              autoCapitalize="none" /></>
          )}

          
          {role === "Coach" && (
            <><Text className="text-gray-700 top-7 ml-4">Description</Text><TextInput
              className="p-4 bg-gray-100 top-9  text-gray-700 rounded-2xl"
              placeholderTextColor="#aaaaaa"
              
              placeholder="Description"
              onChangeText={(text) => setDescription(text)}
              value={description}
              underlineColorAndroid="transparent"
              autoCapitalize="none" /></>
            
          )}

          
          {role === "Coach" && (
            <>
            <View className=" top-2">
            <Text className="text-gray-700 top-9 ml-4">City</Text><TextInput
              className="p-4 bg-gray-100 top-11 mb-10 text-gray-700 rounded-2xl"
              placeholderTextColor="#aaaaaa"
              
              placeholder="City"
              onChangeText={(text) => setCity(text)}
              value={city}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            /></View></>
          )}


          <View style={styles.inputRadio}>
            <TouchableOpacity className="text-gray-700 top-5 right-3 ml-4" onPress={() => handleRadioButtonPress('Player')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: 'black',
                    marginRight: 10,
                    backgroundColor:
                      role === 'Player' ? '#00b365' : 'transparent',

                  }}
                />
                <Text>Player</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="text-gray-700  left-40 ml-4" onPress={() => handleRadioButtonPress('Coach')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: 'black',
                    marginRight: 10,
                    backgroundColor:
                      role === 'Coach' ? '#00b365' : 'transparent',
                  }}
                />
                <Text>Coach</Text>

                
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="text-gray-700  left-40 ml-4" onPress={() => handleRadioButtonPress('Scout')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: 'black',
                    marginRight: 10,
                    backgroundColor:
                      role === 'Scout' ? '#00b365' : 'transparent',
                  }}
                />
                <Text>Scout</Text>

                
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="text-gray-700 bottom-5 right-3 ml-4" onPress={() => handleRadioButtonPress('Tournament Organizer')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: 'black',
                    marginRight: 10,
                    backgroundColor:
                      role === 'Tournament Organizer' ? '#00b365' : 'transparent',
                  }}
                />
                <Text>tournament organizer</Text>

                
              </View>
            </TouchableOpacity>


          </View>

          {value.error && <Text className="py-3 bottom-7" style={{ color: "red", marginLeft: 30, }}>{value.error}</Text>}


          <TouchableOpacity onPress={() => onRegisterPress()}
            className="py-3 bg-yellow-400 bottom-4 rounded-xl">
            <Text className="text-xl  font-bold  text-center text-gray-700" > Create account
            </Text>
          </TouchableOpacity>

        </View>
        <View className="flex-row justify-center bottom-4 mt-3">
          <Text className="text-gray-500 font-semibold">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
            <Text className="font-semibold text-yellow-500"> Log in</Text>
          </TouchableOpacity> 
        </View><View className="bg-white my-9"></View>
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
    
  
   
    marginLeft: 30,
    marginRight: 30,
 
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
