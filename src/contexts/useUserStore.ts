import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  token: string;
  name: string;
  expiredSubscriptionAccount: boolean;
  expiredTrialAccount: boolean;
  setExpiredSubscriptionAccount: (status: boolean) => void;
  setExpiredTrialAccount: (status: boolean) => void;
  setToken: (token: string) => void;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: '',
      name: '',
      expiredTrialAccount: false,
      expiredSubscriptionAccount: false,
      setExpiredSubscriptionAccount: (status: boolean) => set(() => ({ expiredSubscriptionAccount: status })),
      setExpiredTrialAccount: (status: boolean) => set(() => ({ expiredTrialAccount: status })),
      setToken: (token: string) => set(() => ({ token })),
      setName: (name: string) => set(() => ({ name })),
    }),
    {
      name: 'authenticate-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
