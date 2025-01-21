// frontend/firebaseClient.js
// Import required modules from the Firebase SDK
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration object (replace these values with your own)
const firebaseConfig = {
  apiKey: "AIzaSyClnWhll6qW002xjl5q2YpqNR2vUVP-NcY",
  authDomain: "scolarify-d189c.firebaseapp.com",
  projectId: "scolarify-d189c",
  storageBucket: "scolarify-d189c.firebasestorage.app",
  messagingSenderId: "216351382075",
  appId: "1:216351382075:web:108013d07648ac713a9a1e"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export Firebase authentication module
module.exports = { auth, signInWithEmailAndPassword };
