import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
export const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.buttons}>
        <Button style={styles.button}
          title="Sign In"
          onPress={() => navigation.navigate("Sign In")}
        />
        <Button style={styles.button}
          title="Sign Up"
          onPress={() => navigation.navigate("Sign Up")}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color:"#788eec",
    marginBottom: 20,
  },
  buttons:{
    flexGrow:0.05,
    flexDirection:"column",
    justifyContent:"space-between",
    marginTop:50,
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
});
