// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RegisterLand from "./pages/RegisterLand";
import ViewLand from "./pages/ViewLand";
import VerifyLand from "./pages/VerifyLand";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useWallet } from "./context/WalletContext";
import ConfirmDetails from "./pages/Confirmdetails";

function App() {
  const { walletAddress } = useWallet();

  return (
    <Router>
      <Navbar />
      <Routes>
        {!walletAddress && (
          <>
            <Route path="*" element={<Login />} />
          </>
        )}

        {walletAddress && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterLand />} />
            <Route path="/confirm" element={<ConfirmDetails />} /> 
            <Route path="/view" element={<ViewLand />} />
            <Route path="/verify" element={<VerifyLand />} />
            <Route path="/login" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
