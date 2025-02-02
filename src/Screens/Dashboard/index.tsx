import { useState, useEffect } from 'react';
import { getBarberShops, getHaircuts, getProducts, getRates, getSchedules, updateSchedule } from '../../api/api'; // Importando a nova função
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Scissors, Sparkle, ThumbsDown, StackPlus, List, Package, Warehouse, ChartLineUp } from '@phosphor-icons/react'; // Adicionando ícone para schedules
import { Rate } from 'src/types/Rate';
import { useUserStore, useHairCutStore, useScheduleStore, useRateStore, useProductStore, useBarberShopStore } from '../../contexts/';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewScheduleForm from '../../components/NewScheduleForm';
import ScheduleSliderMobile from '../../components/ScheduleSliderMobile';
import ServicesAccordion from '../../components/ServicesAccordion';
import ScheduleListAccordion from '../../components/ScheduleListAccordion';
import { DockIcon } from 'lucide-react';
import { BarberShop } from 'src/types/BarberShop';

const Dashboard = () => {
    const navigate: NavigateFunction = useNavigate();
    // const [haircuts, setHaircuts] = useState<HairCutPaginated>({ data: [], total: 0, totalPages: 0 }); // Estado para armazenar os haircuts
    // const [schedules, setSchedules] = useState<SchedulesPaginated>({ data: [], total: 0, totalPages: 0 }); // Estado para armazenar os schedules
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [highestRate, setHighestRate] = useState<Rate | null>(null)
    const [lowestRate, setLowestRate] = useState<Rate | null>(null)
    const [averateRate, setAverageRate] = useState<number>(0)
    const { token, expiredTrialAccount, expiredSubscriptionAccount, setConfigs, configs } = useUserStore()
    const { setHaircuts, haircuts } = useHairCutStore()
    const { setProducts } = useProductStore()
    const { setSchedules, schedules } = useScheduleStore()
    const { setBarberShops } = useBarberShopStore()
    const { setRates, Rates } = useRateStore()
    const { name } = useUserStore()
    //paginate Schedule 

    const [rangePage, setRangePage] = useState([0, 4])
    function nextSchedule() {
        if (rangePage[1] < schedules.length) {
            setRangePage([rangePage[0] + 4, rangePage[1] + 4])
        }
    }
    function previusSchedule() {
        if (rangePage[0] > 0) {
            setRangePage([rangePage[0] - 4, rangePage[1] - 4])
        }
    }
    async function loading() {
        setTimeout(() => {
            setIsLoading(!isLoading);
        }, 3000);
    }
    async function preLoading() {
        const newConfigs = configs;

        // Carregar franquias
        const barberShopResult = await getBarberShops(token);

        if (barberShopResult.error) {
            toast(barberShopResult.error);

            if (barberShopResult.expiredToken) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
            loading();
            return;
        }

        if (barberShopResult.data) {
            barberShopResult.data.forEach((item: BarberShop) => {
                if (!item.endWork || !item.startWork) {
                    newConfigs.push({
                        type: 'barberShopConfig',
                        message: "Clique no menu, franquias, selecione suas barbearias defina horarios de entrada e saída"
                    })

                    toast('Suas barbearias precisam de configuração de entrada e saída para começar a usar todos os recursos', {
                        closeOnClick: false,
                        pauseOnHover: true,
                        theme: 'colored',
                        type: 'warning',
                        autoClose: 5000,
                    })
                }
            })
            setBarberShops(barberShopResult.data);
        }

        // Carregar Haircuts
        const haircutResult = await getHaircuts(token);
        if (haircutResult.error) {
            toast(haircutResult.error);

            if (haircutResult.expiredToken) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
            loading();
            return;
        }

        if (haircutResult.data) {
            if (haircutResult.data.length <= 0) {
                newConfigs.push({
                    type: 'hairCutConfig',
                    message: "Clique no menu e cadastre serviços e cortes antes de começar a usar"
                })

                toast('Clique no menu e cadastre serviços e cortes antes de começar a usar', {
                    closeOnClick: false,
                    pauseOnHover: true,
                    theme: 'colored',
                    type: 'warning',
                    autoClose: 5000,
                })
            }
            setHaircuts(haircutResult.data);
        }
        // Carregar produtos
        const productsResult = await getProducts(token);
        if (productsResult.error) {
            toast(haircutResult.error);

            if (haircutResult.expiredToken) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
            loading();
            return;
        }

        if (productsResult.data) {

            setProducts(productsResult.data);
        }

        // Carregar Schedules
        const scheduleResult = await getSchedules(token);
        if (scheduleResult.error) {
            setError(scheduleResult.error);

            if (scheduleResult.expiredToken) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
            loading();
            return;
        }
        setSchedules(scheduleResult.data);

        // Carregar Rates
        const ratesResult = await getRates(token);
        if (ratesResult.error) {
            setError(ratesResult.error);

            if (ratesResult.expiredToken) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
            loading();
            return;
        }

        setConfigs(newConfigs)
        setRates(ratesResult.data);
        setHighestRate(getHighestRate(ratesResult.data))
        setLowestRate(getLowestRate(ratesResult.data))
        setAverageRate(calculateAverageRate(ratesResult.data))

        console.log(ratesResult.data);
    }
    async function loadingData() {
        loading();
        if (token !== "" || token) {
            if (expiredSubscriptionAccount) {
                navigate('account-screen')
                return
            }

            if (expiredTrialAccount) {
                navigate('/upgrade-account')
                return
            }

            preLoading()
            loading();
        } else {
            setError('Token não encontrado. Faça login novamente.');
            loading();
        }
    }
    function calculateAverageRate(data: Rate[]): number {
        if (data.length === 0) {
            return 0; // Retorna 0 se não houver avaliações
        }

        const totalRate = data.reduce((sum, rate) => sum + rate.rate, 0);
        const averageRate = totalRate / data.length;

        return averageRate;
    }

    function getHighestRate(data: Rate[]): Rate | null {
        if (data.length === 0) {
            return null; // Retorna null se não houver avaliações
        }

        return data.reduce((highest, current) => (current.rate > highest.rate ? current : highest));
    }
    function getLowestRate(data: Rate[]): Rate | null {
        if (data.length === 0) {
            return null; // Retorna null se não houver avaliações
        }

        return data.reduce((lowest, current) => (current.rate < lowest.rate ? current : lowest));
    }


    async function updateScheduleStatus(id: number, status: string) {
        if (!token) {
            localStorage.clear();
            navigate('/login', { replace: true });
            return;
        }
        await updateSchedule(token, id, { status })
        await loadingData();
    }

    useEffect(() => {
        loadingData();
    }, []); // Executa apenas uma vez quando o componente é montado

    return (
        <div className="flex flex-row sm:gap-10">
            <ToastContainer />
            <div className="sm:w-full sm:max-w-[18rem]">
                <input type="checkbox" id="sidebar-mobile-fixed" className="sidebar-state" />
                <label htmlFor="sidebar-mobile-fixed" className="sidebar-overlay"></label>
                <aside className="sidebar sidebar-fixed-left sidebar-mobile h-full justify-start max-sm:fixed max-sm:-translate-x-full">
                    <section className="sidebar-title items-center p-4">
                        <svg fill="none" height="42" viewBox="0 0 32 32" width="42" xmlns="http://www.w3.org/2000/svg">
                            <rect height="100%" rx="16" width="100%"></rect>
                            <path clipRule="evenodd" d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                        <div className="flex flex-col">
                            <span>Acme</span>
                            <span className="text-xs font-normal text-content2">Team Plan</span>
                        </div>
                    </section>
                    <section className="sidebar-content">
                        <nav className="menu rounded-md">
                            <section className="menu-section px-4">
                                <span className="menu-title">Main menu</span>
                                <ul className="menu-items">
                                    <li className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>General</span>
                                    </li>

                                    <li className="menu-item" onClick={() => navigate("/products")}>
                                        <Package size={24} />
                                        <span>Produtos</span>
                                    </li>
                                    <li className="menu-item" onClick={() => navigate("/services")}>
                                        <Scissors size={24} />
                                        <span>Cortes e Serviços</span>
                                    </li>
                                    <li className="menu-item" onClick={() => navigate("/franchise")}>
                                        <Warehouse size={24} />
                                        <span>Franquias</span>
                                    </li>
                                    <li className="menu-item" onClick={() => navigate("/financial-report")}>
                                        <ChartLineUp  size={24} />
                                        <span>Relatório financeiro</span>
                                    </li>
                                    <li className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span>Billing</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" id="menu-1" className="menu-toggle" />
                                        <label className="menu-item justify-between" htmlFor="menu-1">
                                            <div className="flex gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Account</span>
                                            </div>

                                            <span className="menu-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </label>

                                        <div className="menu-item-collapse">
                                            <div className="min-h-0">
                                                <label className="menu-item menu-item-disabled ml-6">Change Email</label>
                                                <label className="menu-item ml-6">Profile</label>
                                                <label className="menu-item ml-6">Change Password</label>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </section>
                            <div className="divider my-0"></div>
                            <section className="menu-section px-4">
                                <span className="menu-title">Settings</span>
                                <ul className="menu-items">
                                    <li className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="opacity-75" width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M3 21l18 0"></path>
                                            <path d="M3 10l18 0"></path>
                                            <path d="M5 6l7 -3l7 3"></path>
                                            <path d="M4 10l0 11"></path>
                                            <path d="M20 10l0 11"></path>
                                            <path d="M8 14l0 3"></path>
                                            <path d="M12 14l0 3"></path>
                                            <path d="M16 14l0 3"></path>
                                        </svg>
                                        Payments
                                    </li>
                                    <li className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="opacity-75" width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M7 9m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
                                            <path d="M14 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                            <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2"></path>
                                        </svg>
                                        Balances
                                    </li>
                                    <li className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="opacity-75" width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                                            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                                        </svg>
                                        Customers
                                    </li>
                                    <li className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="opacity-75" width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M7 10l5 -6l5 6"></path>
                                            <path d="M21 10l-2 8a2 2.5 0 0 1 -2 2h-10a2 2.5 0 0 1 -2 -2l-2 -8z"></path>
                                            <path d="M12 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                        </svg>
                                        Products
                                    </li>
                                    <li>
                                        <input type="checkbox" id="menu-2" className="menu-toggle" />
                                        <label className="menu-item justify-between" htmlFor="menu-2">
                                            <div className="flex gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="opacity-75" width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11"></path>
                                                    <path d="M9 7l4 0"></path>
                                                    <path d="M9 11l4 0"></path>
                                                </svg>
                                                <span>Contracts</span>
                                            </div>

                                            <span className="menu-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </label>

                                        <div className="menu-item-collapse">
                                            <div className="min-h-0">
                                                <label className="menu-item menu-item-disabled ml-6">Create contract</label>
                                                <label className="menu-item ml-6">All contracts</label>
                                                <label className="menu-item ml-6">Pending contracts</label>
                                                <label className="menu-item ml-6">Security</label>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </section>
                        </nav>
                    </section>
                    <section className="sidebar-footer justify-end bg-gray-2 pt-2">
                        <div className="divider my-0"></div>
                        <div className="dropdown z-50 flex h-fit w-full cursor-pointer hover:bg-gray-4">
                            <label className="whites mx-2 flex h-fit w-full cursor-pointer p-0 hover:bg-gray-4" tabIndex={0}>
                                <div className="flex flex-row gap-4 p-4">
                                    <div className="avatar-square avatar avatar-md">
                                        <img src="https://i.pravatar.cc/150?img=30" alt="avatar" />
                                    </div>

                                    <div className="flex flex-col">
                                        <span>{name}</span>
                                    </div>
                                </div>
                            </label>
                            <div className="dropdown-menu-right-top dropdown-menu ml-2">
                                <a className="dropdown-item text-sm">Profile</a>
                                <a tabIndex={-1} className="dropdown-item text-sm">Account settings</a>
                                <a tabIndex={-1} className="dropdown-item text-sm">Change email</a>
                                <a tabIndex={-1} className="dropdown-item text-sm">Subscriptions</a>
                                <a tabIndex={-1} className="dropdown-item text-sm">Change password</a>
                                <a tabIndex={-1} className="dropdown-item text-sm">Refer a friend</a>
                                <a tabIndex={-1} className="dropdown-item text-sm">Settings</a>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>

            <div className="flex w-full flex-col p-4">
                <div className="w-full flex items-start justify-start">
                    <label htmlFor="sidebar-mobile-fixed" className="sm:hidden">
                        <List size={32} className='text-amber-500' />
                    </label>
                </div>

                {!['barberShopConfig', 'hairCutConfig'].every(requiredType => configs.some(config => config.type === requiredType)) &&
                    <div className='w-full bg-stone-800 p-4 rounded flex flex-col gap-4 '>
                        <div className='flex gap-4'>
                            <div className='bg-stone-800'>
                                <label className="btn bg-amber-700 flex gap-4 md:w-48 w-full justify-center" htmlFor="modal-2">
                                    <span className='md:block text-sm'>Agendamento</span> <StackPlus size={16} color='white' />
                                </label>

                            </div>
                            <div className='bg-stone-800'>
                                <label className="btn bg-amber-700 flex gap-4 md:w-48 w-full justify-center" onClick={() => { alert("Ainda não é possivel ver relatorios") }}>
                                    <span className='md:block text-sm'>Relatórios</span> <DockIcon size={16} color='white' />
                                </label>

                            </div>
                        </div>
                    </div>
                }



                <div className="flex flex-col gap-4 items-start w-full mb-4">
                    {error && <div className="bg-red-500"> {error} </div>}
                    <div className='w-full bg-stone-800 p-4 rounded flex flex-col md:flex-row gap-4 items-center justify-items-center'>
                        {schedules.filter((schedule) => schedule.status === 'finished').length <= 0 &&
                            <div className='md:w-5/12 w-full  p-4 rounded flex flex-col gap-4'>
                                <h1 className='text-2xl font-bold text-center md:text-left'>Avaliações</h1>
                                <div className='flex gap-8 items-center pt-10'>
                                    <div id="rating" className='w-36 h-36 bg-amber-600 flex items-center justify-center rounded-full p-2'>
                                        <div className='border-4 border-black rounded-full p-2 w-32 h-32 flex items-center justify-center'>
                                            <h2 className='text-3xl font-extrabold text-black'>{averateRate}</h2>
                                        </div>
                                    </div>
                                    <ul id="comments" className='flex flex-col gap-8 w-full'>
                                        <li className='flex gap-4 items-center'>
                                            <Sparkle size={32} className='text-white bg-amber-500 p-1 rounded-lg w-36' />
                                            <div className='flex flex-col w-full'>
                                                {highestRate && <p className=''> <span>nota</span>: {highestRate.rate}</p>}
                                                <small> {highestRate?.comment}</small>
                                            </div>
                                        </li>
                                        <li className='flex gap-4 items-center'>
                                            <ThumbsDown size={32} className='text-amber-500 bg-stone-950 p-1 rounded-lg w-36' />

                                            <div className='flex flex-col w-full'>
                                                {lowestRate && <p className=''> <span>nota</span>: {lowestRate.rate}</p>}
                                                <small>{lowestRate?.comment}</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                        <div className=' w-full'>
                            <ul className='w-full bg-stone-800 p-4 rounded flex flex-col gap-4 '>
                                {schedules.filter((schedule) => schedule.status === 'confirmed').length <= 0 ?
                                    (<div className='bg-stone-600 w-full p-2 text-center rounded-lg'>Nenhum agendamento confirmado !</div>)
                                    :
                                    <ScheduleSliderMobile updateScheduleStatus={updateScheduleStatus} />

                                }
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="flex md:flex-row flex-col gap-4 items-start justify-between w-full">
                    <ServicesAccordion haircuts={haircuts} />
                    <ScheduleListAccordion
                        nextSchedule={nextSchedule}
                        previusSchedule={previusSchedule}
                        rangePage={[rangePage[0], rangePage[1]]}
                        schedules={schedules}
                    />
                    {/* <div className="flex w-full items-center justify-center  bg-gray-1">
                        <div className='accordion-group accordion-group-bordered w-full'>
                            <div className="accordion">
                                <input type="checkbox" id="toggle-16" className="accordion-toggle" />
                                <label htmlFor="toggle-16" className="accordion-title">Detalhes rapidos de agendamento</label>
                                <span className="accordion-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
                                </span>
                                <div className="accordion-content text-content2">
                                    <div className="min-h-0">
                                        <ul className='w-full bg-stone-800 p-4 rounded flex flex-col gap-4 '>
                                            {schedules.length > 0 &&
                                                schedules
                                                    .slice(rangePage[0], rangePage[1])
                                                    .map((schedule) => (
                                                        <li key={schedule.id} className='flex justify-around items-center w-full accordion-group-bordered'>

                                                            <div id="name" className={`px-2 py-1 rounded-lg flex items-center justify-between gap-4`}>
                                                                {getScheduleStatus(schedule.status)}  {schedule.status}
                                                            </div>
                                                            <div id="date">
                                                              
                                                                {schedule.time}
                                                            </div>
                                                            <div id="icon" className='bg-stone-950 hover:bg-amber-400 rounded-lg p-1'>
                                                                <Calendar className='text-blue-500 hover:text-white' size={24} />
                                                            </div>
                                                        </li>
                                                    ))
                                            }
                                            <li className='flex justify-center items-center w-full gap-20 py-4'>
                                                <button onClick={() => previusSchedule()} className='bg-stone-950 p-1 rounded-full w-8 h-8 flex justify-center items-center'>
                                                    <ArrowCircleLeft size={42} />
                                                </button>
                                                <button onClick={() => nextSchedule()} className='bg-stone-950 p-1 rounded-full w-8 h-8 flex justify-center items-center'>
                                                    <ArrowCircleRight size={32} />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div> */}
                </div>

            </div>
            <input className="modal-state" id="modal-2" type="checkbox" />
            <div className="modal w-full">
                <label className="modal-overlay" htmlFor="modal-2"></label>
                <div className="modal-content flex flex-col gap-5 w-full">
                    <label htmlFor="modal-2" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <h2 className="text-xl">Novo agendamento</h2>
                    <NewScheduleForm loadingData={loadingData} />
                    <div className="flex gap-3">
                        <button className="btn btn-block">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
