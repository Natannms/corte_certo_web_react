import { ToBRL } from '../utils/convert';
import { useHairCutStore, useUserStore } from '../contexts/index';
import { HairCut } from 'src/types/Haircut';
import { Pencil, Trash } from '@phosphor-icons/react';
import { deleteHairCut } from '../../src/api/api';
import { toast } from 'react-toastify';
type Props ={
    updateTable: ()=> void
}

const HairCutTable = ({updateTable}:Props) => {
    const { haircuts } = useHairCutStore();
    const { token } = useUserStore();

    async function handleDeleteHairCut(id: number) {
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este serviço?");
        if (confirmDelete) {
            const result = await deleteHairCut(id, token)
            if (result.error) {
                toast(result.error, { type: 'error' })
                updateTable()
                return
            }

            toast(result.message, { type: 'success' })
            updateTable()
        }
    }
  
    return (
        <div className="flex flex-col gap-4 p-4 w-full overflow-x-auto">
            <h2 className='text-2xl text-white'>Lista de serviços</h2>
            <table className="table-hover table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th></th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {haircuts.map((haircut: HairCut) => {
                        return (
                            <tr key={haircut.id}>
                                <td><img src={`${haircut.imageUrl}`} className='rounded w-8 h-8' alt="" /></td>
                                <td>{haircut.name}</td>
                                <td>{haircut.description}</td>
                                <td>{ToBRL(haircut.price)}</td>
                                <td className='flex gap-2'>
                                    <button
                                        className='bg-red-500 rounded p-1'
                                        onClick={() => handleDeleteHairCut(haircut.id)}
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

export default HairCutTable;
