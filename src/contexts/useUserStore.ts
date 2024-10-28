import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
    token: string;
    name: string;
    setToken: (token: string) => void;
    setName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: '',
      name: '',
      setToken: (token: string) => set(() => ({ token })),
      setName: (name: string) => set(() => ({ name })),
    }),
    {
      name: 'authenticate-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
