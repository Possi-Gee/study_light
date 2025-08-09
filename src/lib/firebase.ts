
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "scholarsage-sxqow",
  "appId": "1:287042893678:web:d5d2767ba0c0aeca00337f",
  "storageBucket": "scholarsage-sxqow.appspot.com",
  "apiKey": "AIzaSyCLInSIZo2hDs2kn9BqCD0LvpfRixyv5Uo",
  "authDomain": "scholarsage-sxqow.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "287042893678"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
