import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
const Chat = () => {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleAddMessage = (e: any) => {
    setText((prev) => prev + e.emoji);
  };
  const endRef = useRef<any>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: "smooth"});
  },[]);

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
        <Message />
        <Message rec={true} />
        <Message />
        <Message rec={true} />
        <Message rec={true} />
        <Message rec={true} />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message rec={true} />
        <Message />
        <Message rec={true} />
        <Message rec={true} />
        <Message rec={true} />
        <Message />
        <Message />
        <Message />
        <Message rec={true} />
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
              onEmojiClick={handleAddMessage}
            />
          </button>
          <button className="bg-indigo-700 py-1 px-3 rounded">Send</button>
        </div>
      </footer>
    </div>
  );
};

const Message = ({ rec }: { rec?: boolean }) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        rec ? "justify-end" : "justify-start"
      }`}
    >
      <img src="/public/avatar.png" alt="" className="w-12 h-12 rounded-full" />
      <div className="flex flex-col gap-5">
        <span
          className={`text-white text-sm p-2 rounded ${
            rec ? "bg-blue-700" : "bg-gray-700"
          }`}
        >
          Lorem ipsum dolor sit
        </span>
      </div>
    </div>
  );
};

export default Chat;
