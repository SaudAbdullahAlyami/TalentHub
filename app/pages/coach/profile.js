import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,StatusBar
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signOut } from "firebase/auth";
import { useAuthentication } from "../../useAuthentication";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../component/config/config";
import { auth } from "../../component/config/config";
export const CoachProfile = ({ navigation }) => {
  const { user, handleSignOut } = useAuthentication();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(""); //Player OR Scout or ..
  const [email, setEmail] = useState("");

  // data queury from database using auth
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    setFullName(doc.data().fullName);
    setEmail(doc.data().email);
    setRole(doc.data().role);
  });

  return (
    <View style={styles.container}>
    <KeyboardAwareScrollView
      style={{ marginTop:150,flex: 1, width: "100%" }}
      keyboardShouldPersistTaps="always"
    >
      <Text style={styles.input}>
        
       Name: {fullName}
        </Text>
      <Text style={styles.input}>
        {email}

        </Text>
     
<View style={styles.inputRadio}>

    <TouchableOpacity >
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
              role === 'Player' ? 'grey' : 'transparent',
             
          }}
        />
        <Text>Player</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity >
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
            role === 'Coach' ? 'grey' : 'transparent',
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
    marginTop:StatusBar.currentHeight,
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
    zIndex:9,
    position: "absolute",
    top: "50%",
    left: "50%",
    margin: -25,
  },
});
