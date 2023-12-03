import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../component/config/config";
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,StatusBar,Image} from "react-native";
export const SignIn = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const onFooterLinkPress = () => {
    navigation.navigate("Sign Up");
  };

  const onLoginPress = () => {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    signInWithEmailAndPassword(auth,value.email, value.password).then((userCredential) => {
        setValue({
          ...value,
          error: null,
        });
      })
      .catch((error) => {
        setValue({
          ...value,
          error: "Wrong Email or Password",
        });
        console.log(value.error);
      })}
  return (

    <View className="flex-1 bg-white"  style={{backgroundColor: "#00B365"}}>
      <View  className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={()=> navigation.goBack()} 
          className="bg-yellow-400 top-5 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>

        
        <View  className="flex-row justify-center">
          <Image source={require("../../assets/signpic.png")} 
          style={{width: 300, height: 220}} />
        </View>

      </View>
      <View style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
        className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">
            <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
      ></KeyboardAwareScrollView>
     <Text className="text-gray-700 ml-4">Email Address</Text>


            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setValue({ ...value, email: text })}
          value={value.email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
            />


            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
              placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setValue({ ...value, password: text })}
          value={value.password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
            />


             {value.error&&<Text style={{color:"red",marginLeft:30,}}>{value.error}</Text>}

            <TouchableOpacity  onPress={() => onLoginPress()}
              className="py-3 bg-yellow-400 top-3 rounded-xl">
                <Text  className="text-xl  font-bold text-center text-gray-700" > Login
                </Text>
             </TouchableOpacity>
            
          </View>

          <View className="flex-row justify-center mt-7">
              <Text className="text-gray-500 font-semibold">
                  Don't have an account?
              </Text>
              
              <TouchableOpacity  onPress={()=> navigation.navigate('Sign Up')}>
                  <Text className="font-semibold text-yellow-500"> Sign Up</Text>
              </TouchableOpacity>
          </View>
          
      </View>
    </View>


  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    alignItems: "center",
    justifyContent: "center",
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
});
