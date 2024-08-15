import { useNavigate } from "react-router-dom";
import { createUser, fetchUser, UserData } from "../models/userModel";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { useUser } from "../contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(auth, googleAuthProvider);
      const loggedUser: FirebaseUser = signInResult.user;

      let user = await fetchUser(loggedUser.uid);

      if (!user) {
        const userData: UserData = {
          displayName: loggedUser.displayName,
          email: loggedUser.email,
          photoURL: loggedUser.photoURL,
          lastSeen: new Date(),
          uid: loggedUser.uid,
        };
        await createUser(userData);
        user = userData;
      }

      // Here you might want to set the user in your context
      // setUser(user);

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
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
