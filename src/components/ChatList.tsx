import { useEffect, useState } from "react";
import { ChatData} from "../models/chatModel";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import FormModal from "../UIComponents/Modal";
import { useUser } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const ChatList = () => {
  const { currentUser } = useUser();
  const [chats, setChats] = useState<ChatData[]>([]);
  const [search,setSearch] = useState('');
  useEffect(() => {
    const fetchUserChats = onSnapshot(
      collection(db, "chats"),
      (querySnapshot) => {
        const userChats = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((chat) => chat.participants.includes(currentUser?.uid));
        setChats(userChats as ChatData[]);
      }
    );

    return () => fetchUserChats();
  }, [currentUser?.uid]);

  return (
    <aside className="flex flex-col gap-5">
      <div className="flex items-center gap-5 p-5">
        <div className="flex items-center gap-3 px-1 rounded-lg py-1 bg-slate-800">
          <img src="/search.png" alt="Search" className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent px-2 py-1 text-white"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
        <FormModal />
      </div>
      <div className="flex flex-col gap-3">
        {chats.map((chat) => (
          <Chat  key={chat.createdAt.toDate().toISOString()} chat={chat} />
        ))}
      </div>
    </aside>
  );
};

export default ChatList;

function Chat({ chat }: { chat: ChatData }) {
  const [participant, setParticipant] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const { currentUser } = useUser();
  useEffect(() => {
    const fetchParticipant = async () => {
      const participantId = chat?.participants.find((id)=>id!==currentUser?.uid);
      if (participantId) {
        const participantData = await getDoc(doc(db, "users", participantId));
        setParticipant(participantData.data());
      }
    };

    fetchParticipant();
  }, [chat]);
  return (
    <Link to={`/chat/${chat.chatId}`}>
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
          <p>{chat.lastMessage.length>20 ? chat?.lastMessage.substring(0,20):chat?.lastMessage}</p>
          <p className="text-slate-400">{new Date(chat.lastMessageTimestamp?.toDate()).toLocaleString().split(",")[1]}</p>
        </div>
      </div>
    </Link>
  );
}
