import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
// import { MessageData } from "../models/messageModel";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatData, fetchChat } from "../models/chatModel";
import { fetchUser, UserData } from "../models/userModel";
import { MessageData, sendMessage } from "../models/messageModel";
import { useUser } from "../contexts/UserContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from "@chakra-ui/react";
import { CiMenuKebab, CiSearch } from "react-icons/ci";

const ChatWindow = () => {
  // const {onOpen,isOpen,onClose} = useDisclosure();
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [participant, setParticipant] = useState<UserData | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const endRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const navigate = useNavigate();
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
   const handleDeleteChat = async (chatId: string) => {
     if (
       window.confirm(
         "Are you sure you want to delete this chat? This action cannot be undone."
       )
     ) {
       try {
         const chatRef = doc(db, "chats", chatId);

         // Delete all messages in the chat
         const messagesRef = collection(chatRef, "messages");
         const messagesSnapshot = await getDocs(messagesRef);
         const batch = writeBatch(db);

         messagesSnapshot.docs.forEach((doc) => {
           batch.delete(doc.ref);
         });

         await batch.commit();

         // Delete the chat document
         await deleteDoc(chatRef);

         toast({
           position: "top",
           title: "Chat deleted successfully",
           status: "success",
           duration: 3000,
           isClosable: true,
         });

         navigate("/");
       } catch (error) {
         console.error("Error deleting chat:", error);
         toast({
           position: "top",
           title: "Error deleting chat",
           status: "error",
           duration: 3000,
           isClosable: true,
         });
       }
     }
   };

  const handleClearChat = async (chatId: string) => {
    if (
      window.confirm(
        "Are you sure you want to clear all messages in this chat? This action cannot be undone."
      )
    ) {
      try {
        const chatRef = doc(db, "chats", chatId);
        const messagesRef = collection(chatRef, "messages");
        const messagesSnapshot = await getDocs(messagesRef);
        const batch = writeBatch(db);

        messagesSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        
        toast({
          position: "top",
          title: "Chat cleared successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error clearing chat:", error);
        toast({
          position: "top",
          title: "Error clearing chat",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

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
          <CiSearch style={{ color: "white" }} size={24} />
          <Menu>
            <MenuButton
              as={Button}
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "none",
              }}
            >
              <CiMenuKebab size={24} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleClearChat(chatId!)}>Clear Chat</MenuItem>
              <MenuItem onClick={() => handleDeleteChat(chatId!)}>
                Delete Chat
              </MenuItem>
            </MenuList>
          </Menu>
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
