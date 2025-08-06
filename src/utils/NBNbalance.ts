// 获取NBN余额信息
import { ethers } from "ethers";

export async function getNativeBalance(
  userAddress: string,
  provider: ethers.Provider
) {
  try {
    const balance = await provider.getBalance(userAddress);
    return {
      symbol: 'BNB',
      balance: ethers.formatEther(balance), // 主币单位是 18 位
      rawBalance: balance,
    };
  } catch (error) {
    console.error("BNB 余额查询失败", { error, userAddress });
    return null;
  }
}