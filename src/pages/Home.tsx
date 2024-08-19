import List from "../components/List";
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
