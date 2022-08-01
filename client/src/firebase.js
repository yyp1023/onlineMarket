// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD01nXh67etOJhguvFJlV1UcHwrEjus4YQ",
  authDomain: "portfolio-e0340.firebaseapp.com",
  projectId: "portfolio-e0340",
  storageBucket: "portfolio-e0340.appspot.com",
  messagingSenderId: "878649760994",
  appId: "1:878649760994:web:7319b319df34c5005592bb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;