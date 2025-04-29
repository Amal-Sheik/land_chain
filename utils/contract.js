const { web3, account } = require("./web3");
const fs = require("fs");
const path = require("path");

// Load ABI
const contractPath = path.resolve(__dirname, "../artifacts/contracts/LandRecord.sol/LandRecord.json");
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace this
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

module.exports = { contract, account };
