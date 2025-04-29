// src/index.js or src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client"; // ✅ Correct import
import App from "./App";
import './index.css';

import { WalletProvider } from "./context/WalletContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
