import { User } from "firebase/auth"
import ChatList from "./ChatList"
import UserInfo from "./UserInfo"

const List = ({currentUser}:{currentUser:User}) => {
  return (
    <div className="borderRight h-screen w-[30%]">
       <UserInfo currentUser={currentUser}/>
       <ChatList currentUser={currentUser} />
    </div>
  )
}

export default List
