import { useUser } from "../contexts/UserContext";

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
        <img src="/more.png" className="w-6 h-6 " alt="" />
        <img src="/video.png" className="w-6 h-6 " alt="" />
        <img src="/edit.png" className="w-6 h-6 " alt="" />
      </div>
    </header>
  );
};

export default UserInfo;
