import { BarberShop } from 'src/types/BarberShop';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BarberShopState {
    barberShops: BarberShop[];
    selectedBarberShop: number;
    showCreateForm: boolean
    ShowAddColaboratorForm: boolean
    setShowCreateForm: ()=> void
    setShowAddColaboratorForm: ()=> void
    setBarberShops: (list: BarberShop[]) => void;
    addbarberShop: (barberShop: BarberShop) => void; 
    SetSelectedBarberShop: (barberShopId: number) => void; 
}

export const useBarberShopStore = create<BarberShopState>()(
    persist(
        (set) => ({
            barberShops: [],
            showCreateForm: false,
            ShowAddColaboratorForm: false,
            selectedBarberShop: 0,
            setShowCreateForm: () => set((state) => ({ showCreateForm: !state.showCreateForm })),
            setShowAddColaboratorForm: () => set((state) => ({ ShowAddColaboratorForm: !state.ShowAddColaboratorForm })),
            setBarberShops: (list: BarberShop[]) => set(() => ({ barberShops: list })), 
            addbarberShop: (barberShop: BarberShop) => set((state) => ({ barberShops: [...state.barberShops, barberShop] })), 
            SetSelectedBarberShop: (barberShopId: number) => set(() => ({ selectedBarberShop: barberShopId })), 
        }),
        {
            name: 'barberShop',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
