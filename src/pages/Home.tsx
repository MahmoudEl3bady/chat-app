import List from "../components/List";
import ActiveChat from "../components/Chat";

const Home = () => {
  
  return (
    <div className=" flex justify-between ">
      <List />
      <ActiveChat />
    </div>
  );
};

export default Home;
