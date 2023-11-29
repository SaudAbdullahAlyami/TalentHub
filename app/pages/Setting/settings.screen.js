import React from "react";
import { View, Text,StyleSheet,Button } from "react-native";
import { signOut } from "firebase/auth";
import { useAuthentication } from "../../useAuthentication";
export const SettingsScreen = () => {
  const { user ,handleSignOut} = useAuthentication();
  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>

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
