import { ToBRL } from '../utils/convert';
import { Pencil, Trash } from '@phosphor-icons/react';
import { useProductStore } from '../contexts/useProductStore';
import { Product } from 'src/types/Product';

const ProductTable = () => {
    const { products } = useProductStore();

    async function handleDlete(id:number) {
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este Produto?");
        if (confirmDelete) {
            alert(`Produto com ID ${id} foi excluído!`);
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4 w-full overflow-x-auto">
            <h2 className='text-2xl text-white'>Lista de Produtos</h2>
            <table className="table-hover table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nome</th>
                        <th className='hidden md:flex'>Descrição</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item: Product) => {
                        return (
                            <tr key={item.id}>
                                <td><img src={item.imageUrl} className='rounded w-8 h-8' alt="" /></td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td className='hidden md:flex'>{ToBRL(item.price)}</td>
                                <td>{item.quantity}</td>
                                <td className='flex gap-2'>
                                    <button
                                        className='bg-red-500 rounded p-1'
                                        onClick={() => handleDlete(item.id)}
                                    >
                                        <Trash size={24} />
                                    </button>
                                    <button className='bg-amber-500 rounded p-1'>
                                        <Pencil size={24} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ProductTable;
