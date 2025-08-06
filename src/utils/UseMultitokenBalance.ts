// hooks/useMultiTokenBalances.ts
// 支持主币（BNB/ETH）+ 任意代币（ERC-20）查询
// 自动刷新余额（默认每 30 秒，可配置）
// 格式化返回值（含 symbol、balance、rawBalance）
// 自动跳过无效地址或非合约
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export type TokenMeta = {
  name: string;
  symbol: string;
  address: string | null; // null 表示主币（如 BNB）
  icon?: string;
  decimals?: number;
};

export type TokenBalance = {
  name: string;
  symbol: string;
  balance: string;
  rawBalance: bigint;
  icon?: string;
};

export function useMultiTokenBalances(
  userAddress: string | null,
  provider: ethers.Provider | null,
  tokens: TokenMeta[],
  refreshInterval: number = 30000 // 默认30秒刷新一次
) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userAddress || !provider || tokens.length === 0) return;

    let timer: any;

    const fetchBalances = async () => {
      setLoading(true);
      const results: TokenBalance[] = [];

      for (const token of tokens) {
        try {
          if (!token.address) {
            // 主币（如 BNB）
            const raw = await provider.getBalance(userAddress);
            results.push({
              name: token.name,
              symbol: token.symbol,
              icon: token.icon,
              rawBalance: raw,
              balance: ethers.formatEther(raw),
            });
          } else {
            const code = await provider.getCode(token.address);
            if (code === '0x') continue; // 非合约地址

            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const [raw, decimals, symbol] = await Promise.all([
              contract.balanceOf(userAddress),
              token.decimals ? Promise.resolve(token.decimals) : contract.decimals(),
              contract.symbol().catch(() => token.symbol),
            ]);

            results.push({
              name: token.name,
              symbol,
              icon: token.icon,
              rawBalance: raw,
              balance: ethers.formatUnits(raw, decimals),
            });
          }
        } catch (err) {
          console.error(`查询 ${token.symbol} 失败`, err);
        }
      }

      setBalances(results);
      setLoading(false);
    };

    fetchBalances();
    timer = setInterval(fetchBalances, refreshInterval);
    return () => clearInterval(timer);
  }, [userAddress, provider, tokens, refreshInterval]);

  return { balances, loading };
}
