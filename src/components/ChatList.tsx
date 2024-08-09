import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ChatData, getChatsByUser } from "../models/chatModel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ChatList = ({currentUser}:{currentUser:User}) => {
const [userChats,setUserChats] = useState<ChatData[]>();
useEffect(()=>{
    const CurrUserChats = getChatsByUser(currentUser.uid);
    CurrUserChats.then((chats)=>{
      setUserChats(chats)
    })
  },[])

  return (
    <div className="flex flex-col gap-5 ">
      {/* Search Bar */}
      <div className="flex items-center gap-5 p-5 ">
        <div className="flex items-center gap-3 px-1 rounded-lg py-1 bg-slate-800">
          <img src="/search.png" alt="" className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent px-2 py-1   text-white"
          />
        </div>
        <button className="bg-slate-800 rounded-lg p-2">
          <img src="/plus.png" className="w-6" alt="Plus" />
        </button>
      </div>
      {/* Chats */}
      <div className="flex flex-col gap-3 ">
     {
       userChats?.map((chat)=>{
         console.log(chat);
         return <Chat key={chat.id} chat={chat} />
       })
     }
      </div>
    </div>
  );
};

export default ChatList;

function Chat({ chat }: { chat: ChatData }) {
  const [participant, setParticipant] = useState<any>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      const participantRef = doc(db, "users", chat.participants[1]);
      const participantSnapshot = await getDoc(participantRef);
      setParticipant(participantSnapshot.data());
      console.log(participantSnapshot.data());
    };

    fetchParticipant();
  }, [chat]);
  return (
    <div className="flex items-center justify-between border-b text-white rounded py-3 px-3">
      <div className="flex gap-2 items-center">
        <img
          src={participant?.photoURL || "/avatar.png"}
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <span className="text-white">{participant?.displayName} </span>
      </div>
      <div className="text-sm flex flex-col items-end gap-2">
        <p>{chat?.lastMessage || "No last message"}</p>
        <p className="text-slate-400">200</p>
      </div>
    </div>
  );
}
