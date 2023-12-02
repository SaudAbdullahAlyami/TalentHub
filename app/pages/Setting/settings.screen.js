import React, { useState } from "react";
import { View, Text,StyleSheet,Button } from "react-native";
import { signOut } from "firebase/auth";
import { useAuthentication } from "../../useAuthentication";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../component/config/config";
import { auth } from "../../component/config/config";
export const SettingsScreen = () => {
  const { user ,handleSignOut} = useAuthentication();
  const [type,setType]=useState('')
  

  // data queury from database using auth 
  const unsub= onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    
    setType(doc.data().role)
    console.log("Current data: ", doc.data()); 
 
  });




  return (
    <View style={styles.container}>
      <Text>Welcome here is only Player screen</Text>
      <Text>my uid is : {auth.currentUser.uid}</Text>
      <Text>my role is : {type}</Text>
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
