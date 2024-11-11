import React, { useState } from 'react';
import { inviteColaborator } from '../api/api';
import { useUserStore, useBarberShopStore } from '../contexts';
import { toast } from 'react-toastify';
import { X } from '@phosphor-icons/react';
import { BarberShop } from 'src/types/BarberShop';

const AddColaboratorForm = () => {
    const [email, setEmail] = useState<string>('');
    const [selectedBarberShopId, setSelectedBarberShopId] = useState<string>('');
    const { token } = useUserStore();
    const { setShowAddColaboratorForm, barberShops } = useBarberShopStore();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (!selectedBarberShopId) {
                throw new Error("Campos inválidos, selecione uma opção válida");
            }
            // Envia o email e o ID da barbearia para a função inviteColaborator
            const response = await inviteColaborator(email, token, selectedBarberShopId);
            console.log(response);
            toast(response.message, { type: 'success' });
            setShowAddColaboratorForm();
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
            toast('Erro ao registrar novo corte ou serviço:' + error, { type: 'error' });
            console.error('Erro ao registrar novo corte ou serviço:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='bg-zinc-900 p-6 flex flex-col gap-8 rounded'>
            <div className='flex w-full justify-between'>
                <h2 className='text-2xl'>Novo convite</h2>
                <button className='bg-red-500 rounded-full w-6 h-6 items-center flex justify-center'>
                    <X size={18} color='white' onClick={() => setShowAddColaboratorForm()} />
                </button>
            </div>
            <small className='text-1xl'>Adicionar novo colaborador por convite</small>
            <div className="flex flex-col gap-2 justify-center">
                <label htmlFor="unidade">
                    {barberShops.length > 1 ? 'Selecione a unidade' : 'Confirme selecionando a barbearia'}
                </label>
                <select
                    className="select"
                    name='unidade'
                    value={selectedBarberShopId}
                    onChange={(e) => setSelectedBarberShopId(e.target.value)}
                    required
                >
                    <option value="">Selecione a barbearia</option>
                    {barberShops.map((item: BarberShop) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2 justify-center">
                <label htmlFor="email">Email para convite</label>
                <input
                    className="input"
                    type="email"
                    id="email"
                    placeholder='email@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <button type="submit" className='btn btn-primary w-full'>Enviar convite</button>
            </div>
        </form>
    );
};

export default AddColaboratorForm;
