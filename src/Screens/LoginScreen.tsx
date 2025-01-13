import { useEffect, useState } from 'react';
import bg from '../assets/backgrounds/signin.jpg';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingLottie from "../assets/lottie/loading.json";
import { useUserStore } from '../contexts/useUserStore';
import { toast } from 'react-toastify';
import { AuthResponse, login } from '../../src/api/api';

const LoginScreen = () => {
    const navigate: NavigateFunction = useNavigate();
    const { setName, setToken, setExpiredSubscriptionAccount, setExpiredTrialAccount } = useUserStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setIsLoading(true); // Define isLoading diretamente como true
        setError('');

        const response: AuthResponse = await login({ email, password });

        if (response.error) {
            setError(response.error);
            toast(response.error);
        } else {
            const { user, token } = response;
            if (token && user) {
                console.log("login screen", user.expiredTrialAccount);
                setName(user.name)
                setToken(token)
                setIsLoading(false)
                setExpiredSubscriptionAccount(user.isExpired)
                setExpiredTrialAccount(user.expiredTrialAccount)
                navigate('/dashboard', { replace: true, state: { user } })
                return;
            }

            setError("Não foi possivel realiar login, dados não foram obtidos corretamente!");
            toast("Não foi possivel realiar login, dados não foram obtidos corretamente!");

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
        <div className='bg-stone-800 text-white w-full h-screen flex flex-row'>
            <div
                className='bg-stone-600 p-4 w-6/12'
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>
            <div className='bg-stone-800 p-8 w-full flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-bold mb-8'>Barber Shop App</h1>
              
                    <div className='w-8/12'>
                        {error && <div className="bg-red-600 p-2 rounded mb-4">{error}</div>}

                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 mb-4 bg-stone-700 text-white rounded'
                        />
                        <input
                            type='password'
                            placeholder='Senha'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 mb-4 bg-stone-700 text-white rounded'
                        />

                        <button
                            onClick={handleLogin}
                            className={`flex items-center justify-center text-white w-full p-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                 <Lottie animationData={loadingLottie} className='w-8'/>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className='mt-4 text-sm'>
                            Não tem uma conta? <a href='/register' className='text-yellow-400 hover:underline'>Registre-se</a>
                        </p>
                    </div>
            </div>
        </div>
    );
};

export default LoginScreen;
