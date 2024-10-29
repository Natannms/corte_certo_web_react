import { HairCut } from 'src/types/Haircut';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface HaircutState {
    haircuts: HairCut[];
    selectedHairCut: HairCut | null;
    showCreateForm: boolean
    setShowCreateForm: ()=> void
    setHaircuts: (list: HairCut[]) => void;
    addHaircut: (haircut: HairCut) => void; // Nova função para adicionar um item
}

export const useHairCutStore = create<HaircutState>()(
    persist(
        (set) => ({
            haircuts: [],
            showCreateForm: false,
            selectedHairCut: null,
            setShowCreateForm: () => set((state) => ({ showCreateForm: !state.showCreateForm })),
            setHaircuts: (list: HairCut[]) => set(() => ({ haircuts: list })), // Corrigido para atualizar 'haircuts'
            addHaircut: (haircut: HairCut) => set((state) => ({ haircuts: [...state.haircuts, haircut] })), // Adiciona um novo haircut à lista
        }),
        {
            name: 'haircut',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
