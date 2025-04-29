import { ethers } from 'ethers';

export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0]; // Return the first account
    } catch (err) {
      console.error('User rejected connection', err);
      return null;
    }
  } else {
    alert('Please install MetaMask!');
    return null;
  }
};
