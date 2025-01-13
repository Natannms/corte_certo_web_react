import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Clock, DollarSign, Package } from 'lucide-react';

type SubscriptionInfo = {
  plan: string;
  price: number;
  status: 'active' | 'inactive' | 'expired';
  expirationDate: string;
};

export default function AccountScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  const getSubscriptionInfo = async () => {
    try {
      setLoading(true);
      // Simulating API call
      // const response = await api.get('/subscription');
      // setSubscriptionInfo(response.data);
      
      // Mockup data - replace with actual API call
      setSubscriptionInfo({
        plan: 'Básico',
        price: 70.00,
        status: 'active',
        expirationDate: '2025-02-13T23:59:59'
      });
    } catch (err:any) {
      setError('Não foi possível carregar as informações da sua assinatura');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-2xl mx-auto bg-red-900/20 rounded-xl shadow-lg p-8 text-red-400">
          <p>{error}</p>
          <button 
            onClick={getSubscriptionInfo}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-200 mb-8">Minha Conta</h1>
        
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
          {/* Cabeçalho com Status */}
          <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-200">Informações da Assinatura</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-900/20 text-emerald-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Ativa
              </span>
            </div>
          </div>

          {/* Detalhes da Assinatura */}
          <div className="p-6 space-y-6">
            {/* Plano */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-800">
                <Package className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Plano atual</p>
                <p className="text-base font-medium text-gray-200">{subscriptionInfo?.plan}</p>
              </div>
            </div>

            {/* Preço */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-800">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Valor mensal</p>
                <p className="text-base font-medium text-gray-200">
                  {subscriptionInfo?.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
            </div>

            {/* Data de Expiração */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-800">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Válido até</p>
                <p className="text-base font-medium text-gray-200">
                  {new Date(subscriptionInfo?.expirationDate || '').toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Tempo Restante */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-800">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tempo restante</p>
                <p className="text-base font-medium text-gray-200">
                  {Math.ceil((new Date(subscriptionInfo?.expirationDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                </p>
              </div>
            </div>
          </div>

          {/* Footer com Ações */}
          <div className="px-6 py-4 bg-gray-900 border-t border-gray-800">
            <button 
              className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg transition-colors"
              onClick={() => {/* Função para atualizar plano */}}
            >
              Atualizar Plano
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}