// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics , isSupported} from "firebase/analytics";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGQvQG_4fFk0o3YVWYLLACrOPDW6vntFQ",
  authDomain: "collegeproj-d1cd4.firebaseapp.com",
  databaseURL: "https://collegeproj-d1cd4-default-rtdb.firebaseio.com",
  projectId: "collegeproj-d1cd4",
  storageBucket: "collegeproj-d1cd4.firebasestorage.app",
  messagingSenderId: "375003611534",
  appId: "1:375003611534:web:02161cb6cd652c7b0624df",
  measurementId: "G-1ZRY1NV269"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// if (isSupported()) {
//   const analytics = getAnalytics(app);
// } else {
//   console.log("Firebase Analytics is not supported in this environment.");
// }
// previous
// const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };