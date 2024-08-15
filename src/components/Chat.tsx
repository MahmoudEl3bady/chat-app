import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
// import { MessageData } from "../models/messageModel";
import { useParams } from "react-router-dom";
import { ChatData, fetchChat } from "../models/chatModel";
import { fetchUser, UserData } from "../models/userModel";

const ChatWindow = () => {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [participant, setParticipant] = useState<UserData | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatData = async () => {
      if (chatId) {
        try {
          const data = await fetchChat(chatId);
          setChatData(data);
          // Assuming the current user is always the first participant
          const participantId = data?.participants[1];
          const participantData = await fetchUser(participantId!);
          setParticipant(participantData);
        } catch (error) {
          console.error("Error fetching chat data:", error);
        }
      }
    };

    loadChatData();
  }, [chatId]);

  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chatData?.messages]);

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleAddMessage = () => {
    // Implement message sending logic here
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
            src="/public/avatar.png"
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col  items-center">
            <span className="text-white font-bold">
              {participant?.displayName}
            </span>
            <span className="text-green-600 text-sm">online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img src="/public/phone.png" alt="" className="w-5 h-5" />
          <img src="/public/video.png" alt="" className="w-5 h-5" />
          <img src="/public/info.png" alt="" className="w-5 h-5" />
        </div>
      </header>

      {/* Chat Body */}
      <div className="flex flex-col gap-3 h-[80vh] overflow-scroll overflow-x-hidden p-3 ">
        {/* {messages.map((m, i) => (
          <Message key={i} />
        ))} */}
        <div ref={endRef}></div>
      </div>

      <footer className="flex justify-between items-center px-3 mt-auto my-3">
        <div className="flex items-center gap-3">
          <img src="/public/img.png" alt="" className="w-5 h-5 rounded" />
          <img src="/public/camera.png" alt="" className="w-5 h-5 rounded" />
          <img src="/public/mic.png" alt="" className="w-5 h-5 rounded" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-[73%] bg-slate-800 px-3 py-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(!isOpen)}>
            <img src="/public/emoji.png" alt="" className="w-5 h-5 rounded" />
            <EmojiPicker
              open={isOpen}
              style={{ position: "absolute", right: "0", bottom: "55px" }}
              onEmojiClick={onEmojiClick}
            />
          </button>
          <button
            onClick={handleAddMessage}
            className="bg-indigo-700 py-1 px-3 rounded"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

const Message = () => {
  // Props => chatId,senderId , content
  return;
};

export default ChatWindow;
