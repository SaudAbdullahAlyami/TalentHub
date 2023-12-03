import React from "react";
import { View, Text,TouchableOpacity,Image } from "react-native"
export const Welcome = ({ navigation }) => {
  return (
    
   <View className="flex-1" style={{backgroundColor: "#00B365"}}>
        <View className="flex-1 flex justify-around my-5">
            <Text 
                className="text-white font-bold text-4xl text-center top-6">
                Let's Get Started!
            </Text>

            <View className="flex-row justify-center">
                <Image source={require("../../assets/Soccer-bro.png")}
                    style={{width: 350, height: 350}} />
            </View>

            <View className="space-y-4 bottom-8">
                <TouchableOpacity
                    onPress={()=> navigation.navigate('Sign Up')}
                    className="py-3 bg-yellow-400 mx-7 rounded-xl">
                        <Text className="text-xl font-bold text-center text-gray-700">Sign Up</Text>
                </TouchableOpacity>


                <View className="flex-row justify-center">
                    <Text className="text-white font-semibold">Already have an account?</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('Sign In')}>
                        <Text className="font-semibold text-yellow-400"> Log In</Text>
                    </TouchableOpacity>
                </View>

                
            </View>
        </View>
    </View>


    
  );
};










