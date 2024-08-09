import Home from "./pages/Home";
import { useState } from "react";
import Login from "./pages/Login";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  User as firebaseUser,
} from "firebase/auth";
import User ,{UserData}from "./models/userModel";

function App() {
  const [currentUser, setCurrentUser] = useState<firebaseUser | null>(null);
  const handleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(auth, googleAuthProvider);
      const loggedUser = signInResult.user;
      setCurrentUser(loggedUser);
      const user = new User(loggedUser);
      const userData: UserData = {
        displayName: loggedUser?.displayName ||null,
        email: loggedUser?.email || null,
        photoURL: loggedUser?.photoURL||null,
        lastSeen: new Date(),
        uid: loggedUser?.uid || null,
      };
      await user.create(userData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {console.log(currentUser)}
      {currentUser ? (
        <Home currentUser={currentUser} />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
