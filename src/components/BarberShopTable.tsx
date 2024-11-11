import { useBarberShopStore } from '../contexts/index';
import { Envelope, IdentificationCard, Pencil, Trash, TreeView, User } from '@phosphor-icons/react';
import { useState } from 'react';
import { BarberShop, BarberShopUser } from 'src/types/BarberShop';

const BarberShopTable = () => {
    const { barberShops } = useBarberShopStore();
    const [colaborators, setColaborators] = useState<BarberShopUser[]>([])

    function filterBarberShopUser(unitId: number): BarberShopUser[] {
        if (unitId <= 0) {
            return []
        }
        const usersList = barberShops
            .filter((barberShop: BarberShop) => barberShop.id === unitId)[0].BarberShopUser
        setColaborators(usersList)
        return usersList
    }

    async function handleDelete(id: number) {
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este unidade?");
        if (confirmDelete) {
            // Aqui você pode adicionar a lógica para realmente excluir o corte de cabelo
            alert(`unidade com ID ${id} foi excluído!`);
        }
    }
    async function handleDeleteColab(id: number) {
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este colaborador?");
        if (confirmDelete) {
            // Aqui você pode adicionar a lógica para realmente excluir o corte de cabelo
            alert(`colaborador com ID ${id} foi excluído!`);
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4 w-full overflow-x-auto">
            <h2 className='text-2xl text-white'>Unidades</h2>

            <table className="table-hover table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {barberShops.map((barberShop: BarberShop) => {
                        return (
                            <tr key={barberShop.id}   onClick={() => filterBarberShopUser(barberShop.id)}>
                                <th>{barberShop.id}</th>
                                <td>{barberShop.name}</td>
                                <td>{barberShop.address}</td>
                                <td className='flex gap-2'>
                                    <button
                                        className='bg-red-500 rounded p-1'
                                        onClick={() => handleDelete(barberShop.id)}
                                    >
                                        <Trash size={24} />
                                    </button>
                                    <button className='bg-amber-500 rounded p-1'>
                                        <Pencil size={24} />
                                    </button>
                                    <button
                                        onClick={() => filterBarberShopUser(barberShop.id)}
                                        className='bg-blue-500 rounded p-1 flex gap-4 px-4 items-center justify-center text-white'>
                                        <TreeView size={24} /> <p className='hidden md:flex'>Colaboradores</p>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {colaborators.length > 0 && <h2 className='text-2xl text-white'>Colaboradores</h2>}

            {colaborators.length > 0 ?
                <div className='flex gap-4'>
                    <div className="card">
                        <div className="card-body">
                            {colaborators.map((colaborator: BarberShopUser) => {
                                return (
                                    <div className='flex justify-between items-center' key={colaborator.id}>
                                        <div className='flex flex-col gap-4 w-full'>
                                            <div className='items-center w-full flex justify-between'>
                                                {colaborator.user.profilePhotoPath ?
                                                    <img src={colaborator.user.email} />
                                                    :
                                                    <img className='w-14' src={`https://ui-avatars.com/api/?name=${colaborator.user.name}&rounded=true`} alt="" />
                                                }
                                                <p className='flex gap-2 items-center uppercase font-black'><IdentificationCard size={20} className='text-blue-600' /> {colaborator.role}</p>

                                                <div className='flex gap-2'>
                                                    <button
                                                        className='bg-red-500 rounded p-1'
                                                        onClick={() => handleDeleteColab(colaborator.id)}
                                                    >
                                                        <Trash size={24} />
                                                    </button>
                                                    <button className='bg-amber-500 rounded p-1'>
                                                        <Pencil size={24} />
                                                    </button>

                                                </div>
                                            </div>
                                            <div>
                                                <ul className='flex flex- gap-6'>
                                                    <li className='flex gap-2 items-center'><User size={20} className='text-blue-600' />{colaborator.user.name}</li>
                                                    <li className='flex gap-2 items-center'><Envelope size={20} className='text-blue-600' /> {colaborator.user.email}</li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                :
                <p className='text-1xl'>Colaboradores não encontrados ou não filtrados. <span className='text-indigo-500'>Clique em colaboradores em uma das unidades para filtra-los</span></p>
            }
        </div>
    );
}

export default BarberShopTable;
