// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, inMemoryPersistence, browserSessionPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6JnbHdFVz5dIFa7ZhCQrPO2P48R-GPHM",
  authDomain: "realtimechat-24014.firebaseapp.com",
  projectId: "realtimechat-24014",
  storageBucket: "realtimechat-24014.appspot.com",
  messagingSenderId: "161213883793",
  appId: "1:161213883793:web:95301d28da0117ce5a6630",
  measurementId: "G-PTLBV08328",
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
auth.useDeviceLanguage();

// Use browserSessionPersistence instead of inMemoryPersistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to browser session.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };