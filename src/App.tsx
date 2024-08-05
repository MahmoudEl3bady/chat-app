import Detail from "./components/Detail";
import List from "./components/List";
import Chat from "./components/Chat";
function App() {
  return (
    <div className=" flex justify-between ">
      <List />
      <Chat />
      <Detail />
    </div>
  );
}

export default App;
