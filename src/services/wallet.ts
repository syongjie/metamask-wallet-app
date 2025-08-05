import { ethers } from 'ethers';

export async function connectWallet(): Promise<string> {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    return accounts[0];
  } else {
    throw new Error('MetaMask 未安装');
  }
}