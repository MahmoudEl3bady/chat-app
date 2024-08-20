import { signOut } from "firebase/auth";
import { useUser } from "../contexts/UserContext";
import { auth } from "../firebase";
import { FiLogOut } from "react-icons/fi";

const UserInfo = () => {
  const {userData } =useUser();
  return (
    <header className="flex gap-10 justify-between items-center px-2 py-5">
      <div className="flex items-center gap-5">
        <img
          src={userData?.photoURL || "/avatar.png"}
          alt="Profile photo"
          className="w-12 h-12 rounded-full"
        />
        <div className="text-white">{userData?.displayName}</div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => signOut(auth)}
          className="text-red-400 flex items-center gap-1 hover:text-red-300"
        >
          Log out <FiLogOut />
        </button>
      </div>
    </header>
  );
};

export default UserInfo;
