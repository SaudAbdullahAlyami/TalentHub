import React from "react";
import { View, Text,TouchableOpacity,Image,StyleSheet } from "react-native"
import { StatusBar } from "react-native";

export const CoachFormation = ({ navigation }) => {
  return (
    
    <View className="flex-1" style={{backgroundColor: "#00B365"}}>
    <View className="flex-1 flex justify-around my-5">


        <View className="flex-row justify-center top-3" >
            <Image source={require("../../assets/field.jpg")}
                style={{width: 350, height: 500}} />
        </View>
 


                <TouchableOpacity  style={styles.posstiongk}
                    className="items-center	bottom-9 ">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">GK</Text>
                </TouchableOpacity>
                


                <TouchableOpacity style={styles.posstionLb}
                    className="items-start">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold left-3 text-black">LB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionRb}
                    className="items-end">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold right-2 text-black">RB</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.posstionCb1}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCb2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold  text-black">CB</Text>
                </TouchableOpacity>
                   

                <TouchableOpacity style={styles.posstionCm1}
                    className="items-start">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold left-2 text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionCm2}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">CM</Text>
                </TouchableOpacity>
               


                <TouchableOpacity style={styles.posstionCm3}
                    className="items-end">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold right-2 text-black">CM</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionLw}
                    className="items-start">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold left-2 text-black">LW</Text>
                </TouchableOpacity>
 

                <TouchableOpacity style={styles.posstionRw}
                    className="items-end">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold right-2 text-black">RW</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.posstionSt}
                    className="items-center">
                  <Image source={require("../../assets/player.png")}
                style={{width: 40, height: 40}} />
                 <Text className="font-bold text-black">ST</Text>
                </TouchableOpacity>

                </View>

        </View>

  );
};






const styles = StyleSheet.create({
  posstionLb: {
    bottom:160,
    left:60,
  },
  posstiongk: {
    bottom:15,
  },
  posstionRb: {
    bottom:180,
    right:60,
  },
  posstionCb1: {
    bottom:160,
    right:60,
  },
  posstionCb2: {
    bottom:180,
    left:60,
  },
  posstionCm1: {
    bottom:357,
    left:113,
  },
  posstionCm2: {
    bottom:320,
    
  },
  posstionCm3: {
    bottom:400,
    right:110,
  },
  posstionLw: {
    bottom:520,
    left:60,
  },
  posstionRw: {
    bottom:540,
    right:60,
  },
  posstionSt: {
    bottom:630,
  },
});







