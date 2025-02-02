import { useState, useEffect } from 'react';
import { getFinancialReport } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../contexts';
import { Info } from '@phosphor-icons/react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ArrowLeft } from 'lucide-react';

const FinancialReport = () => {
    const navigate = useNavigate();
    const { token } = useUserStore();
    const [showTooltip, setShowTooltip] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);

    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    const [selectedFilter, setSelectedFilter] = useState<'day' | 'week' | 'month' | 'custom'>('month');
    // const [dateRange, setDateRange] = useState({
    //     startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    //     endDate: new Date().toISOString().split('T')[0]
    // });

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await getFinancialReport(token, dateRange.startDate, dateRange.endDate);
            if (response.data) {
                setReportData(response.data);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para pegar primeira data do mês
    const getFirstDayOfMonth = (date: Date = new Date()) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    // Função para pegar última data do mês
    const getLastDayOfMonth = (date: Date = new Date()) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };
    // Função para pegar primeiro dia da semana
    const getFirstDayOfWeek = (date: Date = new Date()) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };
    const handleFilterChange = (filter: 'day' | 'week' | 'month' | 'custom') => {
        setSelectedFilter(filter);
        const today = new Date();
    
        switch (filter) {
          case 'day':
            setDateRange({
              startDate: today.toISOString().split('T')[0],
              endDate: today.toISOString().split('T')[0]
            });
            break;
          case 'week':
           {
            const firstDayOfWeek = getFirstDayOfWeek();
            setDateRange({
              startDate: firstDayOfWeek.toISOString().split('T')[0],
              endDate: today.toISOString().split('T')[0]
            });
            break;
           }
          case 'month':
           {
            const firstDayOfMonth = getFirstDayOfMonth();
            const lastDayOfMonth = getLastDayOfMonth();
            setDateRange({
              startDate: firstDayOfMonth.toISOString().split('T')[0],
              endDate: lastDayOfMonth.toISOString().split('T')[0]
            });
            break;
           }
          case 'custom':
            // Mantém as datas atuais quando muda para customizado
            break;
        }
      };
    useEffect(() => {
        fetchReport();
    }, [dateRange]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const revenueDistribution = reportData ? [
        {
            id: 'Produtos',
            label: 'Vendas de Produtos',
            value: reportData.productRevenue || 0,
        },
        {
            id: 'Serviços',
            label: 'Serviços Realizados',
            value: reportData.serviceRevenue || 0,
        }
    ] : [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white p-4">
             {/* Header com filtros */}
      <div className="bg-[#2d2d2d] p-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-circle btn-ghost"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold">Relatório Financeiro</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Filtros por período */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('day')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'day'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-300'
                  }`}
                >
                  Dia
                </button>
                <button
                  onClick={() => handleFilterChange('week')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'week'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-300'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => handleFilterChange('month')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'month'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-300'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => handleFilterChange('custom')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'custom'
                      ? 'bg-amber-500 text-white'
                      : 'bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-300'
                  }`}
                >
                  Personalizado
                </button>
              </div>

              {/* Data pickers */}
              <div className={`flex gap-2 items-center transition-all ${selectedFilter === 'custom' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input input-sm bg-[#3d3d3d] border-gray-700 text-white"
                />
                <span className="text-gray-400">até</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input input-sm bg-[#3d3d3d] border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-100 rounded-lg p-4 relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info size={20} className="text-gray-400" />
                    </div>
                    <h3 className="text-sm text-gray-800">Receita Total</h3>
                    <p className="text-2xl font-bold text-amber-500 mt-2">
                        {formatCurrency(reportData?.totalRevenue || 0)}
                    </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                    <h3 className="text-sm text-gray-800">Produtos Vendidos</h3>
                    <p className="text-2xl font-bold text-amber-500 mt-2">
                        {formatCurrency(reportData?.productRevenue || 0)}
                    </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                    <h3 className="text-sm text-gray-800">Serviços Realizados</h3>
                    <p className="text-2xl font-bold text-amber-500 mt-2">
                        {formatCurrency(reportData?.serviceRevenue || 0)}
                    </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                    <h3 className="text-sm text-gray-800">Valor Médio por Cliente</h3>
                    <p className="text-2xl font-bold text-amber-500 mt-2">
                        {formatCurrency(reportData?.averageTicket || 0)}
                    </p>
                </div>
            </div>

            {/* Gráficos em linha ou wrap */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Distribuição */}
                <div className="bg-[#2d2d2d] rounded-lg p-4">
                    <h3 className="text-lg mb-1">De onde vem seu dinheiro?</h3>
                    <p className="text-sm text-gray-400 mb-4">Distribuição entre produtos e serviços</p>
                    <div className="h-[300px]">
                        <ResponsivePie
                            data={revenueDistribution}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            innerRadius={0.6}
                            padAngle={0.5}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            colors={['#0053a0', '#c77a06']}
                            borderWidth={1}
                            borderColor={{ theme: 'background' }}
                            enableArcLinkLabels={true}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLinkLabelsTextColor="#9ca3af"
                            arcLabelsTextColor="#ffffff"
                            theme={{
                                background: 'transparent',
                                text: { fill: '#9ca3af' },
                                tooltip: { container: { background: '#1f2937' } }
                            }}
                        />
                    </div>
                </div>

                {/* Top Produtos */}
                <div className="bg-[#2d2d2d] rounded-lg p-4">
                    <h3 className="text-lg mb-1">Produtos Mais Vendidos</h3>
                    <p className="text-sm text-gray-400 mb-4">Os produtos que mais vendem</p>
                    <div className="h-[300px]">
                        <ResponsiveBar
                            data={reportData?.topProducts || []}
                            keys={['totalQuantity', 'totalRevenue']}
                            indexBy="name"
                            groupMode="grouped"
                            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                            padding={0.3}
                            colors={['#c53522', '#c77a06']}
                            theme={{
                                background: 'transparent',
                                text: { fill: '#9ca3af' },
                                tooltip: { container: { background: '#1f2937' } },
                                grid: { line: { stroke: '#374151' } },
                                axis: { domain: { line: { stroke: '#4b5563' } } }
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0
                            }}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -45
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor="#ffffff"
                        />
                    </div>
                </div>

                {/* Top Serviços */}
                <div className="bg-[#2d2d2d] rounded-lg p-4">
                    <h3 className="text-lg mb-1">Serviços Mais Procurados</h3>
                    <p className="text-sm text-gray-400 mb-4">Os serviços favoritos dos clientes</p>
                    <div className="h-[300px]">
                        <ResponsiveBar
                            data={reportData?.topServices || []}
                            keys={['totalQuantity', 'totalRevenue']}
                            indexBy="name"
                            groupMode="grouped"
                            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                            padding={0.3}
                            colors={['#c53522', '#c77a06']}
                            theme={{
                                background: 'transparent',
                                text: { fill: '#9ca3af' },
                                tooltip: { container: { background: '#1f2937' } },
                                grid: { line: { stroke: '#374151' } },
                                axis: { domain: { line: { stroke: '#4b5563' } } }
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0
                            }}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -45
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor="#ffffff"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;