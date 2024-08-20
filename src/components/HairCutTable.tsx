import { DotOutline, Pencil } from '@phosphor-icons/react';
import React from 'react'
type Props = {
    haircuts: any[];
}
const HairCutTable = ({ haircuts }: Props) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h1 className='text-xl font-bold mb-8'>Dashboard</h1>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-stone-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">

                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                
                <tbody>
                    {
                        haircuts.map((haircut) => (
                            <tr className="bg-white border-b dark:bg-stone-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <DotOutline className='text-yellow-500' size={32} />
                                </th>
                                <td className="px-6 py-4">
                                    {haircut.description}
                                </td>
                                <td className="px-6 py-4">
                                    {formatCurrency(haircut.price)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a href="#" className="flex  items-center justify-center gap-2 font-medium text-yellow-600 dark:text-yellow-500 hover:underline">
                                        <Pencil size={22} className='text-yellow-500' />
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>

    );

}
export default HairCutTable; 
