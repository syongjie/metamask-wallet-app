import { create } from 'zustand';

interface WalletState {
  address: string;
  setAddress: (addr: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: '',
  setAddress: (addr) => set({ address: addr }),
}));