// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6JnbHdFVz5dIFa7ZhCQrPO2P48R-GPHM",
  authDomain: "realtimechat-24014.firebaseapp.com",
  projectId: "realtimechat-24014",
  storageBucket: "realtimechat-24014.appspot.com",
  messagingSenderId: "161213883793",
  appId: "1:161213883793:web:95301d28da0117ce5a6630",
  measurementId: "G-PTLBV08328",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
