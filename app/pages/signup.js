
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native';
import { collection, doc, setDoc ,addDoc } from "firebase/firestore"; 
import { db } from '../component/config/config';
export  function SignUp() {

    const [Username,setUsername]=useState('')
    const [email,setemail]=useState('')
    const [name,setname]=useState('')
    const [password,setpassword]=useState('')


    function create(){
        // Add a new document in collection "users"
          addDoc(collection(db, "Users",), {
          Username: Username,  
          email:email,
          name: name,
          password:password
        });
    }
  return (
    <View style={styles.container}>
      <Text>Sign UP </Text>
      <TextInput style={styles.inputBox} value={Username} onChangeText={(Username)=>{setUsername(Username)}} placeholder='Username'></TextInput>
        <TextInput style={styles.inputBox} value={email} onChangeText={(email)=>{setemail(email)}} placeholder='Email'></TextInput>
        <TextInput style={styles.inputBox} value={name} onChangeText={(name)=>{setname(name)}} placeholder='Name'></TextInput>
        <TextInput style={styles.inputBox} value={password} onChangeText={(password)=>{setpassword(password)}} placeholder='Password'></TextInput>
     <Button title='Submit' onPress={create}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputBox:{
        width:230,
        fontSize:13,
        padding:12,
        margin:5,
        borderColor:'black',
        borderWidth:0.3,
        borderRadius:10
      }
  });
  