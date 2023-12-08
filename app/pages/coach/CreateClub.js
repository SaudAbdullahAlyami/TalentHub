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
import { Avatar } from 'react-native-paper';
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot,setDoc } from "firebase/firestore";
import { db, auth, firebase } from "../../component/config/config";

export const CreateClub = ({ navigation }) => {

    const { user, handleSignOut } = useAuthentication();
    const [clubName, setClubName] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");



    //   useEffect(() => {


    //     // Listen for changes in the Firestore document
    //     const unsubscribe = onSnapshot(doc(db, "clubs", auth.currentUser.uid), (doc) => {
    //         setClubName(doc.data().clubName);
    //         setDescription(doc.data().description);
    //         setCity(doc.data().city);
    //     });

    //     // Clean up the subscription when the component unmounts
    //     return () => unsubscribe();
    //   }, []);



 
    const onRegisterPress = () => {
       
        setDoc(doc(db, "clubs",auth.currentUser.uid), {
          clubName: clubName,
          description: description,
          city: city,
        })
          .then(() => {
            console.log("Club added successfully!");
            navigation.navigate('CoachFormation');
          })
          .catch((error) => {
            console.error("Error adding club:", error);
           
          });
      };             

return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>


        <KeyboardAwareScrollView
            style={{ flex: 1, width: "100%", marginTop: 19 }}
            keyboardShouldPersistTaps="always"
        >
            <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}

                className="flex-1 bg-white top-8 px-8 pt-8">
                <View className="form space-y-2">



                    <Text className="text-gray-700 top-1  ml-4">Club Name</Text>
                    <TextInput
                        className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl "
                        placeholder="Club Name"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setClubName(text)}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                    <Text className="text-gray-700 top-1  ml-4">Description</Text>
                    <TextInput
                        className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl "
                        placeholder="Description"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setDescription(text)}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                    <Text className="text-gray-700 top-1  ml-4">City</Text>
                    <TextInput
                        className="p-4 bg-gray-100 top-1 text-gray-700  rounded-2xl "
                        placeholder="City"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setCity(text)}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />


                </View>
                <TouchableOpacity
                    className="py-3 bg-yellow-400 top-9 rounded-xl"
                    onPress={() => onRegisterPress()}
                >
                    <Text className="text-xl  font-bold  text-center text-gray-700">Create Club</Text>
                </TouchableOpacity>
                <View className="bg-white my-9"></View>

            </View>
        </KeyboardAwareScrollView>
    </View>
);

}

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


