import { Rate } from 'src/types/Rate';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RateState {
    Rates: Rate[];
    selectedRate: Rate | null;
    setRates: (list: Rate[]) => void;
    addRate: (Rate: Rate) => void; // Nova função para adicionar um item
}

export const useRateStore = create<RateState>()(
    persist(
        (set) => ({
            Rates: [],
            selectedRate: null,
            setRates: (list: Rate[]) => set(() => ({ Rates: list })), // Corrigido para atualizar 'Rates'
            addRate: (Rate: Rate) => set((state) => ({ Rates: [...state.Rates, Rate] })), // Adiciona um novo Rate à lista
        }),
        {
            name: 'Rate',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
