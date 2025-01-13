import { useBarberShopStore, useUserStore } from '../contexts/index';
import { Envelope, Gear, IdentificationCard, Pencil, Trash, TreeView, User } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteUser, getBarberShops } from '../../src/api/api';
import { BarberShop, BarberShopUser } from '../../src/types/BarberShop';
import loadingLottie from "../assets/lottie/loading.json";
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
// import BarberShopConfigForm from './BarberShopConfigForm';

const BarberShopTable = () => {
    const { barberShops, setBarberShops } = useBarberShopStore();
    const [colaborators, setColaborators] = useState<BarberShopUser[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { token } = useUserStore();
    const navigate =  useNavigate()
    const { SetSelectedBarberShop } = useBarberShopStore();

    function filterBarberShopUser(unitId: number): BarberShopUser[] {
        setIsLoading(true)
        if (unitId <= 0) {
            return []
        }
        const usersList = barberShops
            .filter((barberShop: BarberShop) => barberShop.id === unitId)[0].BarberShopUser
        setColaborators(usersList)
        setIsLoading(false)
        return usersList
    }
    async function updateBarberShopsList() {
         // Carregar franquias
         const barberShopResult = await getBarberShops(token);
         if (barberShopResult.error) {
             toast(barberShopResult.error);

             if (barberShopResult.expiredToken) {
                 localStorage.clear();
                 navigate('/login', { replace: true });
             }
             return;
         }

         if(barberShopResult.data){
            setBarberShops(barberShopResult.data);
        }

    }
    async function handleDelete(id: number) {
        setIsLoading(true)
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este unidade?");
        if (confirmDelete) {
            alert(`unidade com ID ${id} foi excluído!`);
        }
        window.location.reload();

        setIsLoading(false)
    }
    async function handleDeleteColab(id: number) {
        setIsLoading(true)
        if (!token) {
            localStorage.clear()
            navigate("/login")
        }
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este colaborador?");
        if (confirmDelete) {
           const result = await deleteUser(id, token)
           if(result.error){
                toast(result.error, {type: 'error'})
                return;
            }
            toast(result.message, {type: 'success'})
        }
        window.location.reload();

        setIsLoading(false)
    }

    useEffect(()=>{
        updateBarberShopsList()
    },[isLoading])

    return (
        <div className="flex flex-col gap-4 p-4 w-full overflow-x-auto">
            <h2 className='text-2xl text-white'>Unidades</h2>

            <table className="table-hover table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Horario</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {barberShops.map((barberShop: BarberShop) => {
                        return (
                            <tr key={barberShop.id} onClick={() => filterBarberShopUser(barberShop.id)}>
                                <th>{barberShop.id}</th>
                                <td>{barberShop.name}</td>
                                <td>{barberShop.address}</td>
                                <td>{barberShop.endWork && barberShop.startWork && `${barberShop.startWork} ás ${barberShop.endWork}`}</td>
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
                                    <label htmlFor="barberConfig"
                                        onClick={() => {
                                            SetSelectedBarberShop(barberShop.id);
                                            navigate("/barber-shop-config")
                                        }}
                                        className='bg-blue-500 rounded p-1 flex gap-4 px-4 items-center justify-center text-white'>
                                        <Gear  size={24} /> <p className='hidden md:flex'>Configurações</p>
                                    </label>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {colaborators.length > 0 && <h2 className='text-2xl text-white'>Colaboradores</h2>}
            {isLoading &&  <Lottie animationData={loadingLottie} className='w-8'/>}
            {colaborators.length > 0 ?
                <div className='flex gap-4 flex-col md:flex-row items-center justify-center md:flex-wrap'>
                    {colaborators.map((colaborator: BarberShopUser) => {
                        return (
                            <div className="card">
                                <div className="card-body bg-zinc-800 flex gap-2 rounded-xl">
                                    <div className='flex justify-between items-center ' key={colaborator.id}>
                                        <div className='flex flex-col gap-4 w-full'>
                                            <div className='items-center w-full flex justify-between'>
                                                {colaborator.user.profilePhotoPath ?
                                                    <img src={colaborator.user.email} />
                                                    :
                                                    <img className='w-14' src={`https://ui-avatars.com/api/?name=${colaborator.user.name}&rounded=true`} alt="" />
                                                }
                                                <p className='flex gap-2 items-center uppercase font-black'><User size={20} className='text-blue-600' />{colaborator.user.name}</p>

                                                <div className='flex gap-2'>
                                                    <button
                                                        className='bg-red-500 rounded p-1'
                                                        onClick={() => handleDeleteColab(colaborator.user.id)}
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
                                                    <li className='flex gap-2 items-center'><IdentificationCard size={20} className='text-blue-600' />{colaborator.role}</li>
                                                    <li className='flex gap-2 items-center'><Envelope size={20} className='text-blue-600' /> {colaborator.user.email}</li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                :
                <p className='text-1xl'>Colaboradores não encontrados ou não filtrados. <span className='text-indigo-500'>Clique em colaboradores em uma das unidades para filtra-los</span></p>
            }

            <input className="modal-state" id="barberConfig" type="checkbox" />
            <div className="modal w-screen">
                <label className="modal-overlay" htmlFor="barberConfig"></label>
                <div className="modal-content flex flex-col gap-5 w-full">
                    <label htmlFor="barberConfig" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <h2 className="text-xl text-center">Condigurações</h2>
                    {/* <BarberShopConfigForm updateBarberShopsList={updateBarberShopsList} /> */}
                </div>
            </div>
        </div>
    );
}

export default BarberShopTable;
