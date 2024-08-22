import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";
import { ChatData } from "../models/chatModel";
import { SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { fetchUnreadMessageCount } from "../models/messageModel";

function ChatListItem({ chat }: { chat: ChatData }) {
  const { currentUser } = useUser();
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

  const { data: unreadCount } = useQuery({
    queryKey: ["unreadCount", chat.chatId, currentUser?.uid],
    queryFn: async () =>
      await fetchUnreadMessageCount(chat.chatId, currentUser!.uid),
    enabled: !!chat.chatId && !!currentUser?.uid,
  });

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
            <p className="text-slate-400">{chat.lastMessage.split(" ").slice(0, 2)}</p>
          </div>
        </div>
        <div className="text-sm flex flex-col items-end gap-2">
          {unreadCount!=0 &&
          <span className="h-5 w-5  rounded-full text-xs font-semibold bg-blue-600 flex text-gray-100 items-center justify-center">
            {unreadCount} 
          </span>
            }
          <p className="text-slate-400">
            {
              new Date(chat.lastMessageTimestamp?.toDate())
                .toLocaleString()
                .split(",")[1]
            }
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ChatListItem;
