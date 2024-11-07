import React, { useState } from 'react'  
import { createProduct } from '../api/api';
import {useUserStore, useProductStore} from '../contexts'
import { toast } from 'react-toastify';
import { X } from '@phosphor-icons/react';

const ProductForm = () => {  
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number | ''>('');
    const [quantity, setQuantity,] = useState<number | ''>('');
    const [image, setImage] = useState<File | null>(null);

    const {token} = useUserStore()
    const {addProduct, setShowCreateForm} = useProductStore()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', String(price));
        formData.append('quantity', String(quantity));
        if (image) {
            formData.append('image', image);
        }

        // Enviar o formData para o servidor
        try {
           const response = await createProduct(formData, token)
           if(response.data){
               addProduct(response.data)
           }
            // Lidar com a resposta aqui
            toast(response.message, {type:"success"});
            setShowCreateForm()
        } catch (error) {
            toast('Erro ao registrar novo produto:' + error, {type:'error'} );
            console.error('Erro ao registrar novo produto:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='bg-zinc-900 p-6 flex flex-col gap-8 rounded'>
             <div className='flex w-full justify-between'>
                <h2 className='text-2xl'>Cadastrar novo produto</h2>
                <button className='bg-red-500 rounded-full w-6 h-6 items-center flex justify-center'><X size={18} color='white' onClick={()=>setShowCreateForm()}/></button>
             </div>
            <div className="divider"></div>
            <div className="flex flex-col"> 
                <label htmlFor="name">Nome do produto:</label>
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
                <label htmlFor="quantity">Quantidade:</label>
                <input className="input"
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="image">Imagem:</label>
                <input  className="input-file"
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
                <button type="submit" className='btn btn-primary w-full'>Cadastrar Produto</button>
            </div>
        </form>
    );  

}
export default ProductForm; 
