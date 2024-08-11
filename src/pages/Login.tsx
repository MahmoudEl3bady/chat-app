// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import User, { UserData } from "../models/userModel";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useUser } from "../contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(auth, googleAuthProvider);
      const loggedUser = signInResult.user;
      const user = new User(loggedUser);
      const userData: UserData = {
        displayName: loggedUser?.displayName || null,
        email: loggedUser?.email || null,
        photoURL: loggedUser?.photoURL || null,
        lastSeen: new Date(),
        uid: loggedUser?.uid || null,
      };
      await user.create(userData);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (currentUser) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={handleLogin}
        className="py-3 px-2 bg-gray-200 rounded font-bold text-slate-900"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
