import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, RefreshControl } from 'react-native';
import * as ImagePicker from "expo-image-picker"
import { firebase } from "../../component/config/config"
import * as FileSystem from "expo-file-system"

export const PlayerProfile = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);


  const pickimage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const uploadmedia = async () => {
    setUploading(true)

    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => { 
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          resolve(xhr.response)
        };

        xhr.onerror = (e) => {
          reject(new TypeError("network requet faild"))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)
        xhr.send(null)
      })
      const filename = image.substring(image.lastIndexOf('/') + 1)
      const ref = firebase.storage().ref().child(filename);

      await ref.put(blob);
      setUploading(false);
      Alert.alert("photo uploded")
      setImage(null)

    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity style={styles.selectbton} onPress={pickimage}>
        <Text style={styles.buttontext}>pick an image</Text>
      </TouchableOpacity>
      <View>
        {image && <Image
          source={{ uri: image }}
          style={{ width: 300, height: 300 }}
        />}

        <TouchableOpacity style={styles.selectbton} onPress={uploadmedia}>
          <Text >upload image</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",

  },
  selectbton: {
    borderRadius: 5
  },
  buttontext: {

  }

});

