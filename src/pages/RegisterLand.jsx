import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";

const RegisterLand = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { walletAddress } = useContext(WalletContext);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleRegister = async () => {
    if (!selectedFile) return alert("Please upload a document.");
    if (!walletAddress) return alert("Wallet address not found.");
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    setIsUploading(true);
    setMessage("📤 Uploading document and waiting for OCR...");
  
    try {
      const res = await fetch("http://localhost:8000/api/ocr", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.ocr_data) {
        setMessage("✅ OCR success! Redirecting...");
  
        navigate("/confirm", {
          state: {
            ocrData: data.ocr_data,
            walletAddress,
            documentHash: data.document_hash, // ✅ Now included
          },
        });
      } else {
        setMessage("❌ Failed to extract text from image.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setMessage("❌ Server error during OCR.");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📄 Register Land Document
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Document (Image)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={isUploading}
          className={`w-full text-white font-semibold py-2 rounded-lg transition duration-300 ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Processing..." : "Register Land"}
        </button>

        {message && (
          <div className="mt-4 text-center text-sm text-gray-600">{message}</div>
        )}
      </div>
    </div>
  );
};

export default RegisterLand;
