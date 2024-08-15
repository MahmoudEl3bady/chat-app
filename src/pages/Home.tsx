import List from "../components/List";
import ChatWindow from "../components/ChatWindow";
import { Outlet } from "react-router-dom";
const Home = () => {
  return (
    <div className=" flex justify-between ">
      <List />
      <Outlet />
    </div>
  );
};

export default Home;
