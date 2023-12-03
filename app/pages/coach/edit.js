import React, { useState } from "react";
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

import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot ,updateDoc} from "firebase/firestore";
import { db } from "../../component/config/config";
import { auth } from "../../component/config/config";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
export const CoachEdit = ({ navigation }) => {
  const { user, handleSignOut } = useAuthentication();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);

 
  const updatePhoto = () => {


  };

  const handleRadioButtonPress = (value) => {

    setLevel(value)
  };

  const updateData = async () => {
    updateDoc(doc(db, "users", auth.currentUser.uid), {
         fullName: fullName, age: age, height:height, weight:weight, level:level });
    console.log("Updated Successfully");
  };
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%", marginTop: 19 }}
        keyboardShouldPersistTaps="always"
      >
        <View className="flex ">
          <View className="flex-row justify-start">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-yellow-400 top-5 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <ArrowLeftIcon size="20" color="black" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center">
          <TouchableOpacity onPress={() => updatePhoto()}
        >
            <Image
              source={require("../../assets/emptyProfile.jpg")}
              style={{ width: 220, height: 220 ,borderRadius:200}}
            />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-700 top-1  ml-4">Full Name</Text>
        <TextInput
          className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
          placeholder={"Saud Abdullah Alyami"}
          placeholderTextColor="#aaaaaa"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
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

        <Text className="text-gray-700 top-1 ml-4">Height</Text>
         <TextInput
          className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
          placeholder="180cm"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setHeight(text)}
          value={height}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        <Text className="text-gray-700 top-1 ml-4">Weight</Text>
         <TextInput
          className="p-3 bg-gray-100 top-1 text-gray-700 rounded-2x1"
          placeholder="57kg"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setWeight(text)}
          value={weight}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />



<View style={styles.inputRadio}>
      <TouchableOpacity  className="text-gray-700 top-5 right-3 ml-4" onPress={() => handleRadioButtonPress('Beginner')}>
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
              level === 'Beginner' ? '#00b365' : 'transparent',
               
            }}
          />
          <Text>Beginner</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity  className="text-gray-700 top-5 right-3 ml-4" onPress={() => handleRadioButtonPress('Intermediate')}>
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
              level === 'Intermediate' ? '#00b365' : 'transparent',
               
            }}
          />
          <Text>Intermediate</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity  className="text-gray-700  left-44 ml-4" onPress={() => handleRadioButtonPress('expert')}>
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
              level === 'expert' ? '#00b365' : 'transparent',
            }}
          />
          <Text>expert</Text>
        </View>
      </TouchableOpacity>


    </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => updateData()}
        >
          <Text style={styles.buttonTitle}>Update Data</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
    marginTop: 5,
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
