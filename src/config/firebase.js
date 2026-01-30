// Firebase Configuration
// TODO: Replace with your Firebase config from Firebase Console
// Get it from: Firebase Console > Project Settings > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD9zhJx_yan4JPs_eAw4pYpNW3ujNJrJA",
  authDomain: "bien-8e6cc.firebaseapp.com",
  databaseURL: "https://bien-8e6cc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bien-8e6cc",
  storageBucket: "bien-8e6cc.firebasestorage.app",
  messagingSenderId: "734091592679",
  appId: "1:734091592679:web:e72c5f868174eb96b3b342",
  measurementId: "G-93NWPDMNKV" // Optional: for Analytics
};

// Initialize Firebase with error handling
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // App will fallback to localStorage if Firebase fails
}

export { database };
export default app;