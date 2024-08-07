import List from "../components/List";
import Chat from "../components/Chat";
import { User } from "firebase/auth";
const Home = ({currentUser}:{currentUser:User}) => {
  return (
    <div className=" flex justify-between ">
      {/* <h1 className="text-4xl">Welcome {currentUser?.displayName}</h1> */}
      <List currentUser={currentUser}/>
      <Chat />
    </div>
  );
}

export default Home
