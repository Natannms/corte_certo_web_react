import React, { useEffect, useState } from 'react';
import bg from '../assets/backgrounds/signin.jpg';
import { login } from '../api/api'; // Assumindo que a função de login foi criada no arquivo `api.ts`
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingLottie from "../assets/lottie/loading.json";

const LoginScreen = () => {
    const navigate: NavigateFunction = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = async () => {
        setError(''); // Reset error state

        // Enviar os dados de login para o backend
        const response: Response = await login({ email, password });

        if (response.error) {
            setError(response.error);
        } else {
            const { user, token } = response;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);

            navigate('/dashboard', { replace: true, state: { user } })
        }
    };

    async function loading(){
        const token =localStorage.getItem('token')
        if(token && token !== ''){
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            navigate('/dashboard', {replace: true})
            return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setIsLoading(false);
    }

    useEffect(()=>{
        loading();
    })
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
                {isLoading ?
                    <Lottie animationData={loadingLottie} />
                    :
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
                            className='bg-yellow-500 text-white w-full p-2 rounded hover:bg-yellow-600'
                        >
                            Sign In
                        </button>
                        <p className='mt-4 text-sm'>
                            Não tem uma conta? <a href='/register' className='text-yellow-400 hover:underline'>Registre-se</a>
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}

export default LoginScreen;
