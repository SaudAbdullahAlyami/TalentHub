import React, { useEffect } from "react";
import { useState, useContext } from "react";
import {StyleSheet,Text,View,StatusBar,ScrollView,FlatList,} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { UserAuth } from "./pages/Sign-in-out/userAuth";
import {UserNotAuth} from "./pages/Sign-in-out/userNotAuth";
import { useAuthentication } from "./useAuthentication";

export default function App() {
  const [loading, setLoading] = useState(true)
  const [userr, setUserr] = useState(null)
  const { user } = useAuthentication();  useEffect(()=>{
  })
  
  return (
        <NavigationContainer>
            {user?
              (<UserAuth/>):(<UserNotAuth/>)
            }
        </NavigationContainer>
  )   
}
