// src/App.tsx
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import { UserProvider } from "./contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
