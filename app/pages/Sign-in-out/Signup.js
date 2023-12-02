import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../component/config/config";
import { StatusBar } from "react-native";
import { db } from "../../component/config/config";
import {
  doc,
  setDoc,
} from "firebase/firestore";

export const SignUp = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");//Player OR Scout or ..
  const [confirmPassword, setConfirmPassword] = useState("");
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

// for coloring radiobutton


//assign the radiobutton
  const handleRadioButtonPress = (value) => {

    setRole(value)
  };

  const onFooterLinkPress = () => {
    navigation.navigate("Sign In");
  };

  //check if the values empty
  const onRegisterPress = () => {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }
    if(value.password!==confirmPassword){
        setValue({
            ...value,
            error: "passwords dont match",
          });
          return;
    }
    
    
    setTimeout(() => {
        createUserWithEmailAndPassword(auth, value.email, value.password)
      .then((userCredential) => {
        //ADD in db
        setDoc(doc(db, "users",userCredential.user.uid), { 
           uid: userCredential.user.uid,
           email:value.email ,
           fullName:fullName,
           role: role
           });
        console.log("Added Successfully");

        setValue({
            ...value,
            error: null,
          });
          navigation.navigate('Sign In');
      })
      .catch((error) => {
        setValue({
          ...value,
          error: error.message,
        });
      });
      }, 300);
    
  };



  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ marginTop:150,flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setValue({ ...value, email: text })}
          value={value.email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setValue({ ...value, password: text })}

          value={value.password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        
<View style={styles.inputRadio}>

      <TouchableOpacity onPress={() => handleRadioButtonPress('Player')}>
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

      <TouchableOpacity onPress={() => handleRadioButtonPress('Coach')}>
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

        {value.error&&<Text style={{color:"red",marginLeft:30,}}>{value.error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
        >
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
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
