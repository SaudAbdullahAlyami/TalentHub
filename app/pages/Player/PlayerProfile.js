import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, RefreshControl } from 'react-native';
import * as ImagePicker from "expo-image-picker"
import { firebase, auth } from "../../component/config/config"
import * as FileSystem from "expo-file-system"


export const PlayerProfile = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadMedia = async () => {
    setUploading(true);

    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          resolve(xhr.response);
        };

        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);
      const userCollectionPath = `users/${auth.currentUser.uid}/images`; // Dynamically generate collection path based on user ID
      const ref = firebase.storage().ref(userCollectionPath).child(filename);

      await ref.put(blob);
      setUploading(false);
      Alert.alert("Photo uploaded");
      setImage(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      <View>
        {image && (
          <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
        )}

        <TouchableOpacity
          style={styles.selectButton}
          onPress={uploadMedia}
          disabled={uploading}
        >
          {uploading ? <Text>Uploading...</Text> : <Text>Upload Image</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  selectButton: {
    borderRadius: 5,
  },
  buttonText: {},
});
