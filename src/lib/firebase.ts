
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "scholarsage-sxqow",
  "appId": "1:287042893678:web:d5d2767ba0c0aeca00337f",
  "storageBucket": "scholarsage-sxqow.firebasestorage.app",
  "apiKey": "AIzaSyCLInSIZo2hDs2kn9BqCD0LvpfRixyv5Uo",
  "authDomain": "scholarsage-sxqow.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "287042893678"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
