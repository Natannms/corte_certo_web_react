import React from 'react';
import { Scissors, ChevronDown } from 'lucide-react';

type Haircut = {
  id: number;
  description: string;
  price: number;
};

type Props = {
  haircuts: Haircut[];
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function ServicesAccordion({ haircuts }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="text-gray-700 font-medium">Detalhes rápidos de serviços</span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-[500px] opacity-100'
            : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <ul className="divide-y divide-gray-100 bg-amber-500 p-4 space-y-3">
            {haircuts.length > 0 ? (
              haircuts.map((haircut) => (
                <li
                  key={haircut.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800">
                      <Scissors className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-gray-950 text-sm">
                      {haircut.description}
                    </span>
                  </div>
                  <span className="text-black font-medium">
                    {formatCurrency(haircut.price)}
                  </span>
                </li>
              ))
            ) : (
              <li className="py-3 text-center text-gray-300">
                Nenhum serviço disponível
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}