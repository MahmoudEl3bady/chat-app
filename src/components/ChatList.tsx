import { useState } from "react";
import { ChatData } from "../models/chatModel";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import FormModal from "../UIComponents/Modal";
import { useUser } from "../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { CiSearch } from "react-icons/ci";
import ChatListItem from "./ChatListItem";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";
const ChatList = () => {
  const { currentUser } = useUser();
  const [search, setSearch] = useState("");
  const fetchUserChats = async () => {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as ChatData[];
  };
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats", currentUser?.uid],
    queryFn: fetchUserChats,
    enabled: !!currentUser?.uid,
  });
  if (isLoading) {
     return (
    <Box>
      {/* Search and New Chat Button Skeleton */}
      <Flex p={5} gap={5}>
        <Skeleton height="40px" flex={1} />
        <Skeleton height="40px" width="40px" />
      </Flex>

      {/* Chat List Items Skeleton */}
      <VStack spacing={3} align="stretch" px={5}>
        {[...Array(5)].map((_, i) => (
          <Flex key={i} alignItems="center">
            <SkeletonCircle size="10" mr={3} />
            <Box flex={1}>
              <Skeleton height="20px" width="150px" mb={2} />
              <Skeleton height="16px" width="200px" />
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );}

  return (
    <aside className="flex flex-col gap-5 ">
      <div className="flex items-center gap-5 p-5">
        <div className="flex items-center gap-3 px-1 rounded-lg py-1 bg-slate-800">
          <CiSearch style={{ color: "white" }} size={24} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent px-2 py-1 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <FormModal />
      </div>
      <div className="flex flex-col gap-3">
        {chats!.map((chat) => (
          <ChatListItem
            key={chat.chatId}
            chat={chat}
          />
        ))}
      </div>
    </aside>
  );
};

export default ChatList;
