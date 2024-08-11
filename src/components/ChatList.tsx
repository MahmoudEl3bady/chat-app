import { useContext, useEffect, useState } from "react";
import { ChatData, getChatsByUser } from "../models/chatModel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import FormModal from "../UIComponents/Modal";
import { useAuth } from "../hooks/useAuth";
import { AppContext } from "../contexts/AppContext";

const ChatList = () => {
  const { currentUser } = useAuth();
  
  const [chats, setChats] = useState<ChatData[]>([]);

  useEffect(() => {
    const fetchUserChats = async () => {
      const userChats = await getChatsByUser(currentUser?.uid);
      setChats(userChats);
    };

    fetchUserChats();
  }, [currentUser?.uid]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5 p-5">
        <div className="flex items-center gap-3 px-1 rounded-lg py-1 bg-slate-800">
          <img src="/search.png" alt="Search" className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent px-2 py-1 text-white"
          />
        </div>
        <FormModal />
      </div>
      <div className="flex flex-col gap-3">
        {chats.map((chat) => (
          <Chat chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;

function Chat({ chat }: { chat: ChatData }) {
  const [participant, setParticipant] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

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
    <>
      <div
        className="flex items-center justify-between border-b text-white rounded py-3 px-3"
        onClick={() => setExpanded(!expanded)}
      >
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
      {/* {expanded ? <ActiveChat /> : ""} */}
    </>
  );
}
