import { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import List from "../components/List";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChatList, setShowChatList] = useState(true);
  const { chatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && chatId) {
      setShowChatList(false);
    }
  }, [isMobile, chatId]);

  const handleBackToList = () => {
    setShowChatList(true);
    navigate("/");
  };

  return (
    <div className="flex justify-between h-screen">
      {(!isMobile || showChatList) && (
        <div className={`${isMobile ? "w-full" : "w-[30%]"} borderRight`}>
          <List />
        </div>
      )}
      {(!isMobile || !showChatList) && (
        <div className={`${isMobile ? "w-full " : "w-[70%]"}`}>
          {chatId ? (
            <ChatWindow isMobile={isMobile} onBack={isMobile ? handleBackToList : undefined} />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a chat to start messaging
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
