// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./lib/walletConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiProvider config={wagmiConfig}>
        <App />
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>
);