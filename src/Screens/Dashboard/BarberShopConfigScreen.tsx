import { useNavigate } from 'react-router-dom';
import { useUserStore, useBarberShopStore } from '../../contexts';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { BarberShop } from '../../../src/types/BarberShop';
import { getBarberShops, updateBarberShop, createBarberShop } from '../../../src/api/api';
import { ArrowLeft } from '@phosphor-icons/react';

const BarberShopConfigScreen = () => {
    const { token } = useUserStore();
    const { selectedBarberShop, barberShops, setBarberShops } = useBarberShopStore();
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [startWork, setStartWork] = useState<string>('');
    const [endWork, setEndWork] = useState<string>('');
    const [isNewUnit, setIsNewUnit] = useState<boolean>(false); // Estado do switch

    async function loadPage() {
        if (!token) {
            localStorage.clear();
            navigate("/login");
        }

        const list = barberShops.filter((item: BarberShop) => item.id === selectedBarberShop)[0];
        setName(list.name);
        setAddress(list.address !== null ? list.address : '');
        setStartWork(list.startWork !== null ? list.startWork : '');
        setEndWork(list.endWork);
    }

    async function updateBarberShopsList() {
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

        try {
            if (isNewUnit) {
                // Enviar para createBarberShopUser
                const response = await createBarberShop(token, barberShopData);
                if (response.success) {
                    updateBarberShopsList();
                    toast("Nova unidade criada com sucesso", { type: "success" });
                }
            } else {
                // Enviar para updateBarberShop
                const response = await updateBarberShop(token, selectedBarberShop, barberShopData);
                if (response.success) {
                    updateBarberShopsList();
                    toast("Atualizado com sucesso", { type: "success" });
                }
            }
        } catch (error) {
            toast('Erro ao salvar as informações da barbearia: ' + error, { type: 'error' });
            console.error('Erro ao salvar as informações da barbearia:', error);
        }
    }

    useEffect(() => {
        loadPage();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="w-full p-6 flex items-center justify-between">
                <button className='btn bg-zinc-500 flex gap-4' onClick={() => navigate("/franchise")}><ArrowLeft size={24} color='white' /> Voltar</button>
               
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-8 rounded items-center w-full">
                <div className="flex flex-col w-full items-center">
                    <label htmlFor="name">Nome da Barbearia:</label>
                    <input
                        className="input"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full items-center">
                    <label htmlFor="address">Endereço:</label>
                    <input
                        className="input"
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full items-center">
                    <label htmlFor="startWork">Horário de Início:</label>
                    <input
                        className="input"
                        type="time"
                        id="startWork"
                        value={startWork}
                        onChange={(e) => setStartWork(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full items-center">
                    <label htmlFor="endWork">Horário de Encerramento:</label>
                    <input
                        className="input"
                        type="time"
                        id="endWork"
                        value={endWork}
                        onChange={(e) => setEndWork(e.target.value)}
                    />
                </div>
                <div className="flex gap-6 items-center w-80">
                    <input
                        type="checkbox"
                        className="switch switch-success"
                        checked={isNewUnit}
                        onChange={(e) => setIsNewUnit(e.target.checked)} // Atualiza o estado ao mudar
                    />
                    Configurar nova unidade
                </div>
                <div>
                    <button type="submit" className="btn btn-primary w-80">Salvar Configurações</button>
                </div>
            </form>
        </>
    );
};

export default BarberShopConfigScreen;
