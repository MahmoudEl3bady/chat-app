import { useEffect, useRef, useState, useCallback } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatData, deleteChat, fetchChat } from "../models/chatModel";
import { fetchUser, UserData } from "../models/userModel";
import { MessageData } from "../models/messageModel";
import { useUser } from "../contexts/UserContext";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MessageInput from "../UIComponents/MessageInput";

const ChatWindow = () => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [participant, setParticipant] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const { chatId } = useParams<{ chatId: string }>();
  const endRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", currentUser?.uid] });
      toast({
        position: "top",
        title: "Chat deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    },
    onError: (error) => {
      console.error("Error deleting chat:", error);
      toast({
        position: "top",
        title: "Error deleting chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

 

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      if (
        window.confirm(
          "Are you sure you want to delete this chat? This action cannot be undone."
        )
      ) {
        await deleteChatMutation.mutateAsync(chatId);
      }
    },
    [deleteChatMutation]
  );

  const handleClearChat = useCallback(
    async (chatId: string) => {
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
    },
    [toast]
  );

  useEffect(() => {
    const loadChatData = async () => {
      if (chatId) {
        try {
          const data = await fetchChat(chatId);
          setChatData(data);
          const participantId = data?.participants.find(
            (id) => id !== currentUser?.uid
          );
          if (participantId) {
            const participantData = await fetchUser(participantId);
            setParticipant(participantData);
          }

          const messagesRef = collection(db, "chats", chatId, "messages");
          const q = query(messagesRef, orderBy("createdAt", "asc"));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                senderId: data.senderId,
                content: data.content,
                createdAt: data.createdAt?.toDate(),
                read: data.read,
              } as MessageData;
            });
            setMessages(newMessages);
          });
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
              <MenuItem onClick={() => handleClearChat(chatId!)}>
                Clear Chat
              </MenuItem>
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
      <footer className="w-full bg-slate-800 p-3">
      <MessageInput  chatId={chatId}/>
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
