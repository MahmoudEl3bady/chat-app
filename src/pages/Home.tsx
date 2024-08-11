import List from "../components/List";
import ActiveChat from "../components/Chat";
import { User } from "firebase/auth";
import { AppContext } from "../contexts/AppContext";
import { useContext, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
const Home = () => {
  const { userData } = useContext(AppContext);
  
  return (
    <div className=" flex justify-between ">
      <h1 className="text-4xl">Welcome {userData?.displayName}</h1>
      <List />
      <ActiveChat />
    </div>
  );
};

export default Home;
