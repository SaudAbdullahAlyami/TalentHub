// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiShjT8nZiPuTzev9UWOWIZdK_zniA1U8",
  authDomain: "talenthub-f01c4.firebaseapp.com",
  projectId: "talenthub-f01c4",
  storageBucket: "talenthub-f01c4.appspot.com",
  messagingSenderId: "1055326593783",
  appId: "1:1055326593783:web:73e4b575594391365d69f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);