import { useEffect, useState } from 'react';
import bg from '../assets/backgrounds/signin.jpg';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingLottie from "../assets/lottie/loading.json";
import { useUserStore, useBarberShopStore } from '../contexts';
import { toast } from 'react-toastify';
import { AuthResponse, login } from '../../src/api/api';
import logo from '../assets/logos/logo1.png'

const LoginScreen = () => {
    const navigate: NavigateFunction = useNavigate();
    const { setName, setToken, setExpiredSubscriptionAccount, setExpiredTrialAccount, setConfigs } = useUserStore();
    const { setBarberShops } = useBarberShopStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');

        const response: AuthResponse = await login({ email, password });

        if (response.error) {
            setError(response.error);
            toast(response.error);
        } else {
            const { user, token } = response;
            if (token && user) {
                console.log("login screen", user.expiredTrialAccount);
                setBarberShops(response.user!.barbershop);
                setConfigs(response.user!.configs)
                setName(user.name)
                setToken(token)
                setIsLoading(false)
                setExpiredSubscriptionAccount(user.isExpired)
                setExpiredTrialAccount(user.expiredTrialAccount)
                navigate('/dashboard', { replace: true, state: { user } })
                return;
            }

            setError("Não foi possivel realizar login, dados não foram obtidos corretamente!");
            toast("Não foi possivel realizar login, dados não foram obtidos corretamente!");
        }
        setIsLoading(false);
    };

    async function loading() {
        const token = localStorage.getItem('token');
        if (token && token !== '') {
            navigate('/dashboard', { replace: true });
            return;
        }
        setIsLoading(false);
    }

    useEffect(() => {
        loading();
    }, []);

    return (
        <div className="bg-stone-800 text-white w-full h-screen flex flex-col md:flex-row">
            {/* Background image - hidden on small screens, visible on medium and up */}
            <div
                className="hidden md:block md:w-1/2 lg:w-6/12 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${bg})`,
                }}
            ></div>
            
            {/* Login form container - full width on small screens, half on medium and up */}
            <div className="bg-stone-800 px-4 py-10 sm:p-6 md:p-8 w-full h-full md:w-1/2 lg:w-6/12 flex flex-col justify-center items-center gap-10">
                <div className="justify-center items-center flex-col">
                    <h1 className="text-4xl sm:text-4xl font-bold mb-6 sm:mb-8">Corte Certo</h1>
                    <img src={logo} className='w-56' alt="logo escrito corte certo"  />
                </div>
                <div className="w-full max-w-md px-4">
                    {error && <div className="bg-red-600 p-2 rounded mb-4">{error}</div>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-4 bg-stone-700 text-white rounded"
                    />
                    
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 bg-stone-700 text-white rounded"
                    />

                    <button
                        onClick={handleLogin}
                        className={`flex items-center justify-center text-white w-full p-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Lottie animationData={loadingLottie} className="w-8"/>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <p className="mt-4 text-sm text-center">
                        Não tem uma conta? <a href="/register" className="text-yellow-400 hover:underline">Registre-se</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;