import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext';
import illustration from '../assets/A_flat-style_digital_illustration_and_web_design_i.png';

const Home = () => {
  const { walletAddress, handleConnect } = useContext(WalletContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative px-4 py-8">

      {/* Connect Wallet Button - Top Right */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleConnect}
          className="border border-blue-900 text-blue-900 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : 'Connect Wallet'}
        </button>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-blue-900 text-center mt-12 mb-4">LAND CHAIN</h1>

      {/* Subtitle */}
      <p className="text-center text-gray-600 text-lg max-w-xl mb-8 leading-relaxed">
        A Blockchain-based Digital Locker for <br />
        Secure, Tamper-proof Land Record Storage and Verification.
      </p>

      {/* Image Illustration */}
      <img
        src={illustration}
        alt="Illustration"
        className="w-[300px] md:w-[400px] mb-10"
      />

      {/* 3 Main Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <Link
          to="/register"
          className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition text-lg font-medium"
        >
          Register Land
        </Link>
        <Link
          to="/view"
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition text-lg font-medium"
        >
          View Land
        </Link>
        <Link
          to="/verify"
          className="bg-yellow-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition text-lg font-medium"
        >
          Verify Land
        </Link>
      </div>
    </div>
  );
};

export default Home;
