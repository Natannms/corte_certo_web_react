import { Product } from 'src/types/Product';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProductState {
    Products: Product[];
    selectedProduct: Product | null;
    setProducts: (list: Product[]) => void;
    addProduct: (Product: Product) => void; // Nova função para adicionar um item
}

export const useProductStore = create<ProductState>()(
    persist(
        (set) => ({
            Products: [],
            selectedProduct: null,
            setProducts: (list: Product[]) => set(() => ({ Products: list })), // Corrigido para atualizar 'Products'
            addProduct: (Products: Product) => set((state) => ({ Products: [...state.Products, Products] })), // Adiciona um novo Product à lista
        }),
        {
            name: 'Product',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
