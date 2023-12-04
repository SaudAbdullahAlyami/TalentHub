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

import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot } from "firebase/firestore";
import { db ,auth,firebase } from "../../component/config/config";
export const CoachProfile = ({ navigation }) => {
  const { user, handleSignOut } = useAuthentication();
  const [imageURL, setImageURL] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState(""); //Player OR Scout or ..
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);



  useEffect(() => {
 

    // Listen for changes in the Firestore document
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      setFullName(doc.data().fullName);
      setAge(doc.data().age);
      setRole(doc.data().role);
      setHeight(doc.data().height);
      setWeight(doc.data().weight);
      setLevel(doc.data().level);
      setImageURL(doc.data().profileImage)
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#00B365" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%", marginTop: 19 }}
        keyboardShouldPersistTaps="always"
      >
        <View className="flex ">
          <View className="flex-row justify-start">
            <TouchableOpacity
              onPress={() => navigation.navigate("CoachEdit")}
              className="bg-yellow-400 top-5 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center">
            
            <Image
              source={({uri : imageURL})}
              style={{ width: 220, height: 220,borderRadius:200 }}
            />
          </View>
        </View>

        <Text style={styles.input}>Name: {fullName}</Text>
        <Text style={styles.input}>Age: {age}</Text>
        <Text style={styles.input}>role: {role}</Text>
        <Text style={styles.input}>height: {height}</Text>
        <Text style={styles.input}>weight: {weight}</Text>
        <Text style={styles.input}>Level: {level}</Text>

        <View style={styles.inputRadio}>
          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "black",
                  marginRight: 10,
                  backgroundColor: role === "Player" ? "grey" : "transparent",
                }}
              />
              <Text>Player</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "black",
                  marginRight: 10,
                  backgroundColor: role === "Coach" ? "grey" : "transparent",
                }}
              />
              <Text>Coach</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
        >
          <Text style={styles.buttonTitle}>Create account</Text>
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
