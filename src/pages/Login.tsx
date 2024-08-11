import User, { UserData } from "../models/userModel";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  User as firebaseUser,
} from "firebase/auth";

const Login = () => {
  const handleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(auth, googleAuthProvider);
      const loggedUser = signInResult.user;
      // setCurrentUser(loggedUser);
      const user = new User(loggedUser);
      const userData: UserData = {
        displayName: loggedUser?.displayName || null,
        email: loggedUser?.email || null,
        photoURL: loggedUser?.photoURL || null,
        lastSeen: new Date(),
        uid: loggedUser?.uid || null,
      };
      await user.create(userData);
       window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={handleLogin}
        className="py-3 px-2 bg-gray-200 rounded font-bold  text-slate-900"
      >
        Sign in with google
      </button>
    </div>
  );
};

export default Login;
