import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRa86QMYSuHsyEkMS4qzWN7St169gOKy0",
  authDomain: "appi-ivy-59b06.firebaseapp.com",
  databaseURL: "https://appi-ivy-59b06-default-rtdb.firebaseio.com",
  projectId: "appi-ivy-59b06",
  storageBucket: "appi-ivy-59b06.firebasestorage.app",
  messagingSenderId: "1098604639434",
  appId: "1:1098604639434:web:cef0b1a2b06f1d8e477033",
  measurementId: "G-K3NCVW1WEK"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);