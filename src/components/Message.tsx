import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useUser } from "../contexts/UserContext";
import { MessageData } from "../models/messageModel";

const Message = ({ message }: { message: MessageData }) => {
  // Props => chatId,senderId , content
  const { currentUser } = useUser();
  const isMyMessage = message.senderId === currentUser?.uid;
  let msgStatus ;

  if (message.read && isMyMessage) {
    msgStatus = <IoCheckmarkDoneOutline color=""/>;
  }else if(isMyMessage&&!message.read){
    msgStatus = <IoCheckmarkOutline />;
  }
  return (
    <div className={`flex  ${isMyMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={ `flex px-3 flex-col items-end ${ 
          isMyMessage ? "bg-blue-600" : "bg-slate-600"
        } p-2 rounded-xl text-white max-w-[60%]`}
      >
        <p className="text-white">{message.content}</p>
        <span className="text-sm text-gray-300">{msgStatus}</span>
      </div>
    </div>
  );
};
export default Message;