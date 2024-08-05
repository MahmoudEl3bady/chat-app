const ChatList = () => {
  return (
    <div className="flex flex-col gap-5 ">
      {/* Search Bar */}
      <div className="flex items-center gap-5 p-5 ">
        <div className="flex items-center gap-3 px-1 rounded-lg py-1 bg-slate-800">
          <img src="/public/search.png" alt="" className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent px-2 py-1   text-white"
          />
        </div>
        <button className="bg-slate-800 rounded-lg p-2">
          <img src="/public/plus.png" className="w-6" alt="" />
        </button>
      </div>
      {/* Chats */}
      <div className="flex flex-col gap-3 ">
        <Chat />
        <Chat />
        <Chat />
        <Chat />
        <Chat />
      </div>
    </div>
  );
};

export default ChatList;

function Chat({}) {
  return (
    <div className="flex items-center justify-between borderBottom  text-white rounded py-3 px-3 ">
      <div className="flex gap-2 items-center">
        <img
          src="/public/avatar.png"
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <span className="text-white">John Doe</span>
      </div>
      <div className="text-sm flex flex-col items-end gap-2">
        <p>Lorem ipsum dolor sit</p>
        <p className="text-slate-400">2:09am</p>
      </div>
    </div>
  );
}
