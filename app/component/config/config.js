import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAiShjT8nZiPuTzev9UWOWIZdK_zniA1U8",
  authDomain: "talenthub-f01c4.firebaseapp.com",
  projectId: "talenthub-f01c4",
  storageBucket: "talenthub-f01c4.appspot.com",
  messagingSenderId: "1055326593783",
  appId: "1:1055326593783:web:73e4b575594391365d69f2"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}


export { auth, db ,firebase};