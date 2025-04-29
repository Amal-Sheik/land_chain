const { JsonRpcProvider, Wallet, Contract } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const CONTRACT_ABI = require("../abi/LandRecord.json").abi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new JsonRpcProvider(process.env.RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// ✅ Register Land
const registerLand = async (req, res) => {
    try {
      const { documentHash } = req.body;
  
      if (!documentHash) {
        return res.status(400).json({ success: false, message: "Document hash is required." });
      }
  
      // Check if already registered
      try {
        const existing = await contract.getLandByHash(documentHash);
        if (existing && existing.documentHash) {
          return res.status(409).json({
            success: false,
            message: "❌ This document is already registered on blockchain.",
          });
        }
      } catch (e) {
        // Allow through if getLandByHash fails (means it's not registered)
        console.log("ℹ️ No existing registration found, continuing...");
      }
  
      const tx = await contract.registerLand(documentHash);
      await tx.wait();
  
      return res.status(200).json({
        success: true,
        message: "✅ Land registered successfully on blockchain",
        txHash: tx.hash,
      });
    } catch (error) {
      console.error("❌ registerLand error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  

// ✅ View Land by Wallet Address
const viewLandByWallet = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required." });
    }

    console.log("\n🔍 Viewing Land for Wallet Address:", walletAddress);

    const hashes = await contract.getHashesByWallet(walletAddress);

    console.log("📦 Hashes Retrieved from Contract:", hashes);

    const responses = await Promise.all(
      hashes.map(async (hash) => {
        try {
          console.log("🔗 Fetching data for hash from FastAPI:", hash);

          const response = await axios.get("http://localhost:8000/api/land/view", {
            params: { document_hash: hash }
          });

          if (response.data.status === "success") {
            console.log("✅ Data fetched successfully for hash:", hash);
            return {
              documentHash: hash,
              landDetails: response.data.data
            };
          } else {
            console.warn(`⚠️ Hash mismatch or error for hash ${hash}`);
            return null;
          }
        } catch (err) {
          console.error(`❌ Error fetching data for hash ${hash}:`, err.message);
          return null;
        }
      })
    );

    const validLands = responses.filter((r) => r !== null);

    console.log("✅ Total Valid Lands Fetched:", validLands.length);

    return res.status(200).json({ lands: validLands });
  } catch (error) {
    console.error("❌ viewLandByWallet error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerLand,
  viewLandByWallet
};
