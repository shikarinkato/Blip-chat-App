import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StateProvider from "./context/StateProvider.jsx";
import { ChakraProvider } from "@chakra-ui/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider disableGlobalStyle>
      <BrowserRouter>
        <StateProvider>
          <App />
        </StateProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
