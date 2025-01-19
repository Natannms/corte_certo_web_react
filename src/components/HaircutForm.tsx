import React, { useState } from 'react'
import { createHaircut, getHaircuts } from '../api/api';
import { useUserStore, useHairCutStore } from '../contexts'
import { toast } from 'react-toastify';
import { X } from '@phosphor-icons/react';

const HairCutForm = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number | ''>('');
    const [image, setImage] = useState<File | null>(null);
    const { token } = useUserStore()
    const { setHaircuts, setShowCreateForm } = useHairCutStore()
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', String(price));
        if (image) {
            formData.append('image', image);
        }

        // Enviar o formData para o servidor
        try {
            const response = await createHaircut(formData, token)
            if (response.data) {
                // Carregar Haircuts
                const haircutResult = await getHaircuts(token);
                if (haircutResult.error) {
                    toast(haircutResult.error);

                    return;
                }

                if (haircutResult.data) {
                    setHaircuts(haircutResult.data);
                }
            }
            // Lidar com a resposta aqui
            toast(response.message, { type: "success" });
            setShowCreateForm()
        } catch (error) {
            toast('Erro ao registrar novo corte ou serviço:' + error, { type: 'error' });
            console.error('Erro ao registrar novo corte ou serviço:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='bg-zinc-900 p-6 flex flex-col gap-8 rounded'>
            <div className='flex w-full justify-between'>
                <h2 className='text-2xl'>Cadastrar novo serviço</h2>
                <button className='bg-red-500 rounded-full w-6 h-6 items-center flex justify-center'><X size={18} color='white' onClick={() => setShowCreateForm()} /></button>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col">
                <label htmlFor="name">Nome do serviço ou corte:</label>
                <input className="input"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="description">Descrição breve:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className='textarea'
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="price">Preço:</label>
                <input className="input"
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="image">Imagem:</label>
                <input className="input-file"
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) {
                            setImage(e.target.files[0]);
                        }
                    }}
                    required
                />
            </div>
            <div>
                <button type="submit" className='btn btn-primary w-full'>Cadastrar</button>
            </div>
        </form>
    );

}
export default HairCutForm; 
