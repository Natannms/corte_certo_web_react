import { Product } from 'src/types/Product';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    showCreateForm: boolean;
    setShowCreateForm: () => void;
    setProducts: (list: Product[]) => void;
    addProduct: (product: Product) => void; 
    setSelectedProduct: (product: Product | null) => void; 
}

export const useProductStore = create<ProductState>()(
    persist(
        (set) => ({
            products: [],
            selectedProduct: null,
            showCreateForm: false,
            setShowCreateForm: () => set((state) => ({ showCreateForm: !state.showCreateForm })),
            setProducts: (list: Product[]) => set(() => ({ products: list })), 
            setSelectedProduct: (product: Product | null) => set(() => ({ selectedProduct: product })), // Corrigido para atualizar 'haircuts'
            addProduct: (product: Product) => set((state) => ({ products: [...state.products, product] })), 
        }),
        {
            name: 'products',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
