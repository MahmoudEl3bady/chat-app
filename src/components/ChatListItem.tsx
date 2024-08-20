import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";
import { ChatData } from "../models/chatModel";
import { SkeletonCircle, SkeletonText } from "@chakra-ui/react";

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
        <div className="flex gap-2 items-center">
          <img
            src={participant?.photoURL || "/avatar.png"}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <span className="text-white">{participant?.displayName}</span>
        </div>
        <div className="text-sm flex flex-col items-end gap-2">
          <p>
            {chat.lastMessage.length > 20
              ? chat.lastMessage.substring(0, 20)
              : chat.lastMessage}
          </p>
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
