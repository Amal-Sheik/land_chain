import React, { useState } from 'react';

const ViewLand = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [lands, setLands] = useState([]);
  const [error, setError] = useState('');

  const fetchLandRecords = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/land/view/${walletAddress}`);
      const data = await response.json();

      if (data.lands && data.lands.length > 0) {
        setLands(data.lands);
        setError('');
      } else {
        setLands([]);
        setError('No valid land records found.');
      }
    } catch (err) {
      console.error(err);
      setError('No records found or an error occurred.');
      setLands([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-semibold mb-4">View Land Records by Wallet</h2>

      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="border px-4 py-2 mb-4 w-96 rounded"
      />
      <button
        onClick={fetchLandRecords}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Fetch Land Records
      </button>

      {lands.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-2">Verified Land Records:</h3>
          <ul className="space-y-4">
            {lands.map((land, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded shadow">
                <p><strong>Owner:</strong> {land.landDetails.owner}</p>
                <p><strong>Location:</strong> {land.landDetails.location}</p>
                <p><strong>Document Hash:</strong> {land.documentHash}</p>
                <p><strong>Verified:</strong> ✅</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ViewLand;
