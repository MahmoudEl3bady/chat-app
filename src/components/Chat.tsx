import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { User } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
const ActiveChat = () => {
  const { currentUser } = useAuth();
  const initailMessages = [
    { rec: true, body: "Hello" },
    { rec: false, body: "Hi" },
    {
      rec: false,
      body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt, beatae!",
    },
    {
      rec: true,
      body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt, beatae!",
    },
  ];
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initailMessages);
  const onEmojiClick = (e: any) => {
    setText((prev) => prev + e.emoji);
  };

  const handleAddMessage = () => {
    // if (!text) return;
    // setMessages([...messages, { rec: false, body: text }]);
    // setText("");
    

  };
  const endRef = useRef<any>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
            <span className="text-white font-bold">John Doe</span>
            <span className="text-green-600 text-sm">Online</span>
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
        {messages.map((m, i) => (
          <Message key={i} rec={m.rec} body={m.body} />
        ))}
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

const Message = ({ rec, body }: { rec?: boolean; body: string }) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        !rec ? "justify-end" : "justify-start"
      }`}
    >
      <img src="/public/avatar.png" alt="" className="w-12 h-12 rounded-full" />
      <div className="flex flex-col gap-5">
        <p
          className={`text-white text-md p-2 rounded max-w-[40vw] ${
            !rec ? "bg-blue-500" : "bg-gray-600"
          }`}
        >
          {body}
        </p>
      </div>
    </div>
  );
};

export default ActiveChat;
