import { useNavigate } from 'react-router-dom';
import { useUserStore, useBarberShopStore } from '../../contexts';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { BarberShop } from '../../../src/types/BarberShop';
import { getBarberShops, updateBarberShop } from '../../../src/api/api';

const BarberShopConfigScreen = () => {
    const { token } = useUserStore();
    const { selectedBarberShop, barberShops, setBarberShops } = useBarberShopStore();
    const navigate = useNavigate()

    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [startWork, setStartWork] = useState<string>('');
    const [endWork, setEndWork] = useState<string>('');

    async function loadPage() {
        if (!token) {
            localStorage.clear()
            navigate("/login")
        }

        const list = barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0];
        setName(list.name)
        setAddress(list.address !== null ? list.endWork : '')
        setStartWork(list.startWork !== null ? list.endWork : '')
        setEndWork(list.endWork)
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

        if (barberShopResult.data) {
            console.log(barberShopResult);
            setBarberShops(barberShopResult.data);
        }

    }
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const barberShopData = {
            name,
            address,
            startWork,
            endWork,
        };

        // Enviar os dados para o servidor
        try {
            const response = await updateBarberShop(token, selectedBarberShop, barberShopData);
            if (response.success) {
                updateBarberShopsList()
                toast("Atualizado com sucesso", { type: "success" })
            }
            toast(response.success, { type: "success" });
        } catch (error) {
            toast('Erro ao atualizar informações da barbearia: ' + error, { type: 'error' });
            console.error('Erro ao atualizar informações da barbearia:', error);
        }
    }

    useEffect(() => {
        loadPage()
    }, [])

    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-8 rounded items-center w-full">
                <div className="flex flex-col w-full  items-center">
                    <label htmlFor="name">Nome da Barbearia : </label>
                    <input
                        className="input"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                    // placeholder={barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].name
                    //     ? barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].name
                    //     : ''
                    // }
                    />
                </div>
                <div className="flex flex-col w-full  items-center">
                    <label htmlFor="address">Endereço:</label>
                    <input
                        // placeholder={barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].address
                        //     ? barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].address
                        //     : ''
                        // }
                        className="input"
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}

                    />
                    <small></small>
                </div>
                <div className="flex flex-col w-full  items-center">
                    <label htmlFor="startWork">Horário de Início:</label>
                    <input
                        className="input"
                        type="time"
                        id="startWork"
                        value={startWork}
                        onChange={(e) => setStartWork(e.target.value)}

                    />
                    <small className="">{
                        // barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].startWork
                        //     ? barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].startWork
                        //     :
                        //     'horário de inicio ainda não foi definido'
                    }</small>
                </div>
                <div className="flex flex-col w-full  items-center">
                    <label htmlFor="endWork">Horário de Encerramento:</label>
                    <input
                        className="input"
                        type="time"
                        id="endWork"
                        value={endWork}
                        onChange={(e) => setEndWork(e.target.value)}

                    />
                    {/* <small className="">{barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].startWork ? barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0].startWork : 'horário de encerramento ainda não foi definido'}</small> */}

                </div>
                <div>
                    <button type="submit" className="btn btn-primary w-full">Salvar Configurações</button>
                </div>
            </form>
        </>
    );

}
export default BarberShopConfigScreen; 
