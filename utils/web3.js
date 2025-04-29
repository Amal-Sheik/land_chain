const Web3 = require("web3").default;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Use local Hardhat node
const web3 = new Web3("http://127.0.0.1:8545");

const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

module.exports = { web3, account };
