import { ToBRL } from '../utils/convert';
import { Pencil, Trash } from '@phosphor-icons/react';
import { useProductStore, useUserStore } from '../contexts';
import { Product } from '../../src/types/Product';
import { deleteProduct } from '../../src/api/api';
import { toast } from 'react-toastify';

const ProductTable = () => {
    const { products, setProducts } = useProductStore();
    const { token } = useUserStore();

    async function handleDlete(id:number) {
        
        if(!id){
            toast("Houve um erro interno ao selecionar item para exclusão e seu identificador é inexistente.")
            return
        }
        
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este Produto? #" + id);
        if (confirmDelete) {
            const excludeItem = await deleteProduct(id, token)
            if(excludeItem.error){
                toast(excludeItem.error)
                return
            }

            const newProducts = products.filter(product => product.id !== id);
            setProducts(newProducts)

            toast(excludeItem.message)
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
                                {/* <td><img src={`http://localhost:8080/product-image/${item.imageName}`} className='rounded w-8 h-8' alt="" /></td> */}
                                <td><img src={`${item.imageUrl}`} className='rounded w-8 h-8' alt="" /></td>
                              
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
