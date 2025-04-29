// src/context/WalletContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { connectWallet } from "../utils/wallet";

// Create the context
export const WalletContext = createContext();

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };
    checkWallet();
  }, []);

  const handleConnect = async () => {
    const address = await connectWallet();
    if (address) setWalletAddress(address);
  };

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress, handleConnect }}>
      {children}
    </WalletContext.Provider>
  );
};
