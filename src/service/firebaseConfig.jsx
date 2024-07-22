// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBM41LyXlf8yhnkJ4yvLDA0ZuXhFHVjnHU",
  authDomain: "ai-trip-planeer.firebaseapp.com",
  projectId: "ai-trip-planeer",
  storageBucket: "ai-trip-planeer.appspot.com",
  messagingSenderId: "227824327273",
  appId: "1:227824327273:web:1eec5eed07cbebdbd460f8",
  measurementId: "G-HHBESY1193"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
