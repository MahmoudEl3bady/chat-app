// List.tsx
import ChatList from "./ChatList";
import UserInfo from "./UserInfo";

const List = () => {
  return (
    <div className="flex flex-col h-full">
      <UserInfo />
      <div className="flex-grow overflow-y-auto">
        <ChatList />
      </div>
    </div>
  );
};

export default List;
