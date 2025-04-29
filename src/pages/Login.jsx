// pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import illustration1 from '../assets/meta.png';

const Login = () => {
  const { setWalletAddress } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert("🦊 MetaMask not detected. Please install it.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const wallet = accounts[0];
      setWalletAddress(wallet);
      navigate("/"); // or to "/dashboard"
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      alert("⚠️ Connection rejected.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md">
        <img src={illustration1} alt="MetaMask" className="w-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
        <p className="text-gray-600 mb-6">
          Please connect your MetaMask wallet to continue.
        </p>
        <button
          onClick={handleConnect}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          🔗 Connect Wallet
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Don't have MetaMask?{" "}
          <a href="https://metamask.io" className="text-indigo-500 underline" target="_blank" rel="noreferrer">
            Get it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
