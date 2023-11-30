import React, { useState } from "react";
import { View, Text,StyleSheet,Button } from "react-native";
import { signOut } from "firebase/auth";
import { useAuthentication } from "../../useAuthentication";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../component/config/config";

export const SettingsScreen = () => {
  const [type,setType]=useState('')
  
  const unsub= onSnapshot(doc(db, "users", "RjEwQhGoqsgCG2jJ27A8UQ1Wds93"), (doc) => {
    
    setType(doc.data().role)
    console.log("Current data: ", doc.data()); 

    console.log("Role data: ", type); 
  }
  );



  const { user ,handleSignOut} = useAuthentication();
  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>
      <Text>my role is : {type}!</Text>
      
      <Button
        title="Sign Out"
        style={styles.button}
        onPress={handleSignOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 10,
  },
});
