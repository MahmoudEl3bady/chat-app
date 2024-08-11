import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
// theme.js
import { extendTheme } from "@chakra-ui/react";
import AppContextProvider from "./contexts/AppContext.tsx";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "rgb(15 23 42 /1)",
        color: "black",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
