// src/App.tsx
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
