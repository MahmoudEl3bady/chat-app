import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
// import { MessageData } from "../models/messageModel";
import { useParams } from "react-router-dom";
import { ChatData, fetchChat } from "../models/chatModel";
import { fetchUser, UserData } from "../models/userModel";
import { MessageData, sendMessage } from "../models/messageModel";
import { useUser } from "../contexts/UserContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from "@chakra-ui/react";

const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [participant, setParticipant] = useState<UserData | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const endRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<MessageData[]>([]);

  const toast = useToast();
  const getParticipantLastSeen = () => {
    //TODO : Parse the lastseen of the chat user and if it same as current timestamp displays "online"
  };
  useEffect(() => {
    const loadChatData = async () => {
      if (chatId) {
        try {
          const data = await fetchChat(chatId);
          // console.log("Fetched chat data:", data);
          setChatData(data);
          const participantId = data?.participants.find(
            (id) => id !== currentUser?.uid
          );
          if (participantId) {
            const participantData = await fetchUser(participantId);
            setParticipant(participantData);
          }

          // Set up real-time listener for messages
          const messagesRef = collection(db, "chats", chatId, "messages");
          // console.log("Messages collection reference:", messagesRef);
          const q = query(messagesRef, orderBy("createdAt", "asc"));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                senderId: data.senderId,
                content: data.content,
                createdAt: data.createdAt?.toDate(), // Convert Firestore Timestamp to Date
                read: data.read,
              } as MessageData;
            });
            // console.log(snapshot.docs);

            setMessages(newMessages);
          });
          // Clean up listener on unmount
          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching chat data:", error);
        }
      }
    };

    loadChatData();
  }, [chatId, currentUser]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleSendMessage = async () => {
    if (!chatId || !currentUser || !message.trim()) {
      toast({
        title: "Failed to send message",
        description: "Message cannot be empty",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      await sendMessage(chatId, currentUser.uid, message.trim());
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!chatData || !participant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-[80%] borderRight relative">
      {/* Chat Header */}
      <header className="flex justify-between items-center px-4 py-5 borderBottom">
        <div className="flex items-center gap-5">
          <img
            src={`${participant?.photoURL || "/avatar.png"}`}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col  items-center">
            <span className="text-white font-bold">
              {participant?.displayName}
            </span>
            <span className="text-green-600 text-sm">
              {new Date(participant.lastSeen).toLocaleString().split(",")[1]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img src="/phone.png" alt="" className="w-5 h-5" />
          <img src="/video.png" alt="" className="w-5 h-5" />
          <img src="/info.png" alt="" className="w-5 h-5" />
        </div>
      </header>

      {/* Chat Body */}
      <div className="flex flex-col gap-3 h-[80vh] overflow-scroll overflow-x-hidden p-3 ">
        {messages.map((message) => (
          <Message message={message} key={message.createdAt.getTime()} />
        ))}
        <div ref={endRef}></div>
      </div>

      <footer className="flex justify-between items-center px-3 mt-auto my-3">
        <div className="flex items-center gap-3">
          <img src="/img.png" alt="" className="w-5 h-5 rounded" />
          <img src="/camera.png" alt="" className="w-5 h-5 rounded" />
          <img src="/mic.png" alt="" className="w-5 h-5 rounded" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-[73%] bg-slate-800 px-3 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(!isOpen)}>
            <img src="/emoji.png" alt="" className="w-5 h-5 rounded" />
            <EmojiPicker
              open={isOpen}
              style={{ position: "absolute", right: "0", bottom: "55px" }}
              onEmojiClick={onEmojiClick}
            />
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-indigo-700 py-1 px-3 rounded"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

const Message = ({ message }: { message: MessageData }) => {
  // Props => chatId,senderId , content
  const { currentUser } = useUser();
  return (
    <div
      // key={message.createdAt}
      className={`flex ${
        message.senderId === currentUser?.uid ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`${
          message.senderId === currentUser?.uid ? "bg-blue-600" : "bg-slate-600"
        } p-2 rounded-xl text-white max-w-[60%]`}
      >
        <span className="text-white">{message.content}</span>
      </div>
    </div>
  );
};

export default ChatWindow;
