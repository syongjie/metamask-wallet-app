import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  setAddress: (addr: string) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
    }),
    {
      name: 'wallet-storage', // localStorage key
      partialize: (state) => ({ address: state.address }), // 只保存 address
    }
  )
);