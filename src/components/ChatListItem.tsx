import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";
import { ChatData } from "../models/chatModel";
import { SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { chatLastMessageTime } from "../utils/dateHelper";
import { useQuery } from "@tanstack/react-query";

function ChatListItem({ chat }: { chat: ChatData }) {
  const { currentUser } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  const participantId = chat.participants.find((id) => id !== currentUser?.uid);

  const { data: participant, isLoading } = useQuery({
    queryKey: ["participant", participantId],
    queryFn: async () => {
      if (!participantId) return null;
      const docRef = doc(db, "users", participantId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    },
    enabled: !!participantId,
  });

  useEffect(() => {
    if (!chat.chatId || !currentUser?.uid) return;

    const messagesRef = collection(db, "chats", chat.chatId, "messages");
    const q = query(
      messagesRef,
      where("read", "==", false),
      where("senderId", "!=", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUnreadCount(querySnapshot.size);
    });

    return () => unsubscribe();
  }, [chat.chatId, currentUser?.uid]);

  if (isLoading)
    return (
      <div className="flex items-center justify-between border-b text-white rounded py-3 px-3">
        <div className="flex gap-2 items-center">
          <SkeletonCircle boxSize="16" />
          <SkeletonText noOfLines={1} spacing="4px" />
        </div>
        <div className="text-sm flex flex-col items-end gap-2">
          <SkeletonText noOfLines={1} spacing="2px" />
          <SkeletonText noOfLines={1} spacing="2px" />
        </div>
      </div>
    );

  return (
    <Link to={`/chat/${chat.chatId}`}>
      <div className="flex items-center justify-between bg-gray-900 shadow-sm hover:bg-gray-800 text-white rounded py-3 px-3">
        <div className="flex gap-3 items-center">
          <img
            src={participant?.photoURL || "/avatar.png"}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div className="">
            <p className="text-white font-medium">{participant?.displayName}</p>
            <p className="text-slate-400 text-sm">
              {chat.lastMessage.substring(0, 27)}
            </p>
          </div>
        </div>
        <div className="text-sm flex flex-col items-end gap-2">
          {unreadCount !== 0 && (
            <span className="h-5 w-5 rounded-full text-xs font-semibold bg-blue-600 flex text-gray-100 items-center justify-center">
              {unreadCount}
            </span>
          )}
          <p className="text-slate-400">
            {chatLastMessageTime(chat.lastMessageTimestamp)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ChatListItem;
