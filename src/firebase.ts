// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth with custom settings
const auth = getAuth(app);
auth.useDeviceLanguage();

// Set persistence to 'none' (in-memory) to prevent persistent sessions across tabs
setPersistence(auth, inMemoryPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in-memory only.
    // Closing the window would clear any existing state.
    console.log("Firebase Auth persistence set to in-memory.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
