import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { ocrData, documentHash } = location.state || {};

  const handleConfirm = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/land/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentHash }),
      });

      const data = await res.json();
      console.log("✅ Backend response:", data);

      if (res.status === 409) {
        alert("❌ This land document is already registered.");
      } else if (res.ok && data.success) {
        alert("✅ Land record registered successfully!");
        navigate("/");
      } else {
        console.error("❌ Registration failed:", data.message || data.error);
        alert("❌ Failed to register land record.");
      }
    } catch (error) {
      console.error("❌ Error during confirmation:", error);
      alert("❌ Error occurred during confirmation.");
    }
  };

  if (!ocrData || !documentHash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">⚠️ Missing Data</h2>
          <p className="text-gray-600 mt-2">
            Please upload and process a document first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8 border-b pb-4">
          🧾 Confirm Land Record Details
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.entries(ocrData).map(([key, value]) => (
            <div key={key} className="bg-gray-50 border rounded-xl p-5 shadow-sm">
              <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{key}</p>
              <p className="text-base text-gray-800 font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-lg"
          >
            ✅ Confirm & Register on Blockchain
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDetails;
