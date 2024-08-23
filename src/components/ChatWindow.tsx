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
import Message from "./Message";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";

const ChatWindow = ({onBack , isMobile}:{onBack:()=>void | undefined,isMobile:boolean}) => {
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
    const getChatData = async () => {
      if (chatId) {
        const chatRef = collection(db, "chats", chatId, "messages");
        const chatMessages = await getDocs(chatRef);
        const batch = writeBatch(db);

        chatMessages.docs.forEach((msg) => {
          if (msg.data().senderId !== currentUser?.uid && !msg.data().read) {
            const messageRef = doc(chatRef, msg.id);
            batch.update(messageRef, { read: true });
          }
        });

        await batch.commit();
      }
    };

    getChatData();
  }, [chatId, currentUser]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  if (!chatData || !participant) {
   return (
     <Box height="100vh" display="flex" flexDirection="column">
       {/* Header Skeleton */}
       <Flex p={4} bg="gray.800" alignItems="center">
         <SkeletonCircle size="10" mr={3} />
         <Box flex={1}>
           <Skeleton height="20px" width="150px" mb={2} />
           <Skeleton height="14px" width="100px" />
         </Box>
         <Skeleton height="24px" width="24px" mr={3} />
         <Skeleton height="24px" width="24px" />
       </Flex>

       {/* Messages Skeleton */}
       <VStack flex={1} overflowY="auto" spacing={4} p={4}>
         {[...Array(6)].map((_, i) => (
           <Flex
             key={i}
             w="100%"
             justifyContent={i % 2 === 0 ? "flex-end" : "flex-start"}
           >
             <Box maxW="70%">
               <SkeletonText noOfLines={2} spacing="2" />
             </Box>
           </Flex>
         ))}
       </VStack>

       {/* Input Skeleton */}
       <Flex p={4} bg="gray.800">
         <Skeleton height="40px" flex={1} mr={2} />
         <Skeleton height="40px" width="40px" />
       </Flex>
     </Box>
   );

  }
  return (
    <div className="flex flex-col xs:w-[100%]  h-screen borderRight relative">
      {/* Chat Header */}
      <header className="flex justify-between items-center px-4 py-5  bg-slate-950 bg-opacity-10 shadow-md ">
        {onBack && (
          <button onClick={onBack} className="text-white mr-3">
            <RxHamburgerMenu />
          </button>
        )}
        <div className="flex items-center gap-5">
          <img
            src={`${participant?.photoURL || "/avatar.png"}`}
            alt=""
            className="w-11 h-11 rounded-full"
          />
          <div className="flex flex-col  items-start">
            <p className="text-white font-bold">{participant?.displayName}</p>
            <p className="text-green-500 text-sm">
              {/* {formatTimestamp(participant?.lastSeen)}  */} online
            </p>
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
      <main className={`flex flex-col gap-3 ${!isMobile?"px-16":"px-3"} px-16 h-[80vh] overflow-scroll overflow-x-hidden `}>
        {messages.map((message) => (
          <Message message={message} key={message.content} />
        ))}
        <div ref={endRef}></div>
      </main>
      <footer className={`w-full bg-slate-950 bg-opacity-30 ${isMobile?"p-1 absolute bottom-1":"p-3"}`}>
        <MessageInput chatId={chatId} />
      </footer>
    </div>
  );
};

export default ChatWindow;
