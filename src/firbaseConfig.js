// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmS9jK2zHKx20v3_otA6UpS4xf98nLtWI",
  authDomain: "phobiaai.firebaseapp.com",
  projectId: "phobiaai",
  storageBucket: "phobiaai.firebasestorage.app",
  messagingSenderId: "88810652770",
  appId: "1:88810652770:web:5f190ed74eb8a2f874bd3b",
  measurementId: "G-C8BSL3ZLR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);