import { useUser } from "../contexts/UserContext";
import { MessageData } from "../models/messageModel";

const Message = ({ message }: { message: MessageData }) => {
  // Props => chatId,senderId , content
  const { currentUser } = useUser();
  return (
    <div
      // key={message.createdAt}
      className={`flex ${
        message.senderId === currentUser?.uid ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`${
          message.senderId === currentUser?.uid ? "bg-blue-600" : "bg-slate-600"
        } p-2 rounded-md text-white max-w-[60%]`}
      >
        <div className="">
        <p className="text-white">{message.content}</p>
        {/* <p className="text-white">{message.createdAt.toString().split("GMT")[0].split(" ")[4].split(':')}</p> */}
        </div>
          
      </div>
    </div>
  );
};

export default Message;