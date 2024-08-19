import { useState, memo, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import { sendMessage } from "../models/messageModel";
import { useUser } from "../contexts/UserContext";
import { useToast } from "@chakra-ui/react";
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
        await sendMessage(chatId, currentUser.uid, message.trim());
        setMessage(""); // Clear the input field after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }, [chatId, currentUser, message, toast]);

    const onEmojiClick = useCallback((emojiObject: { emoji: string }) => {
      setMessage((prev) => prev + emojiObject.emoji);
    }, []);

    return (
      <footer className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <img src="/img.png" alt="" className="w-5 h-5 rounded" />
          <img src="/camera.png" alt="" className="w-5 h-5 rounded" />
          <img src="/mic.png" alt="" className="w-5 h-5 rounded" />
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          className="w-[73%] bg-slate-800 px-3 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(!isOpen)}>
            <img src="/emoji.png" alt="" className="w-5 h-5 rounded" />
            <EmojiPicker
              open={isOpen}
              style={{ position: "absolute", right: "0", bottom: "55px" }}
              onEmojiClick={onEmojiClick}
            />
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-indigo-700 py-1 px-3 rounded"
          >
            Send
          </button>
        </div>
      </footer>
    );
  }
);

export default MessageInput;
