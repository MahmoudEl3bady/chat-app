import { useNavigate } from "react-router-dom";
import { createUser, fetchUser, UserData } from "../models/userModel";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { useToast } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../contexts/UserContext";
const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
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
      toast({
        title: `Welcome , ${user.displayName}!`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      navigate("/");
    } catch (error) {
      toast({
        title:error as string,
        position: "top-right",
        status: "error",
        duration: 3000,
      });
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
        className="flex gap-2 items-center py-3 px-2 bg-gray-200 rounded font-bold text-slate-900"
      >
        Sign in with 
        <FcGoogle size={24}/>
      </button>
    </div>
  );
};

export default Login;
