// utils/Balance .ts
import { ethers } from 'ethers';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export async function getTokenBalance(
  userAddress: string,
  tokenAddress: string,
  provider: ethers.Provider
) {
  try {
    const code = await provider.getCode(tokenAddress);
    if (code === '0x') {
      throw new Error(`地址 ${tokenAddress} 不是合约`);
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(userAddress),
      contract.decimals(),
      contract.symbol(),
    ]);

    return {
      symbol,
      balance: ethers.formatUnits(balance, decimals),
      rawBalance: balance,
    };
  } catch (error) {
    console.error('代币余额查询失败:', { error, tokenAddress, userAddress });
    return null;
  }
}