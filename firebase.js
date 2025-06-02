// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtAKBVp6Hyf2eXv1Wo0YLuuE1hfZ80MgM",
  authDomain: "public-seed-vault-app.firebaseapp.com",
  projectId: "public-seed-vault-app",
  storageBucket: "public-seed-vault-app.firebasestorage.app",
  messagingSenderId: "194363722248",
  appId: "1:194363722248:web:7ca20411d166c164089fbd",
  measurementId: "G-6DEP8JY9VP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
