import Home from "./pages/Home";
import { useState } from "react";
import Login from "./pages/Login";
import { auth, db } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { doc,getDoc } from "firebase/firestore";
import { createUser, UserData } from "./models/userModel";
import {useAuthState} from "react-firebase-hooks/auth"

function App() {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);
  const[u] = useAuthState(auth);

  const handleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(auth, googleAuthProvider);
      const user = signInResult.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        const userData: UserData = {
          name:user.displayName||"",
          email:user.email||"",
          profilePictureUrl:user.photoURL||"",
          status:"online",
        }
       await createUser(user.uid, userData)
      }

      setCurrentUser(u);
      // console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* {console.log(currentUser)} */}
      {u ? (
        <Home currentUser={u} />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </>
  );
}

export default App;

