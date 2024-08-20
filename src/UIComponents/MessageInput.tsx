import { useState, memo, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import { sendMessage } from "../models/messageModel";
import { useUser } from "../contexts/UserContext";
import { useToast } from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
const MessageInput = memo(
  ({ chatId }: { chatId: string |undefined}) => {
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const {currentUser} = useUser();
    const toast=useToast();
    const handleSendMessage = useCallback(async () => {
      if (!chatId || !currentUser || !message.trim()) {
        toast({
          title: "Failed to send message",
          description: "Message cannot be empty",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {
        setMessage(""); // Clear the input field after sending
        await sendMessage(chatId, currentUser.uid, message.trim());
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }, [chatId, currentUser, message, toast]);

    const onEmojiClick = useCallback((emojiObject: { emoji: string }) => {
      setMessage((prev) => prev + emojiObject.emoji);
    }, []);

    return (
      <footer className="flex justify-around items-center w-full">
        <div className="flex item-center gap-4">
          <img src="/img.png" alt="" className="w-6 h-6 rounded" />
          <button onClick={() => setIsOpen(!isOpen)}>
            <img src="/emoji.png" alt="" className="w-6 h-6 rounded" />
            <EmojiPicker
              open={isOpen}
              style={{ position: "absolute", left: "0", bottom: "55px" }}
              onEmojiClick={onEmojiClick}
            />
          </button>
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-[73%] focus:outline-none text-white bg-slate-900 px-3 py-2.5 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          autoFocus={true}
        />
        <button
          onClick={handleSendMessage}
          className=""
        >
          <IoMdSend size={34} style={{color:"gray"}}/>
        </button>
      </footer>
    );
  }
);

export default MessageInput;
