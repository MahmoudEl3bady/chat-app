import List from "../components/List";
import ActiveChat from "../components/Chat";
import { User } from "firebase/auth";
import { ChakraProvider } from "@chakra-ui/react";
const Home = ({currentUser}:{currentUser:User}) => {
  return (
    <div className=" flex justify-between ">
      {/* <h1 className="text-4xl">Welcome {currentUser?.displayName}</h1> */}
      <List currentUser={currentUser}/>
      <ActiveChat />

    </div>
  );
}

export default Home
