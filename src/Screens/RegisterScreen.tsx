import { useState } from 'react';
import { register } from '../api/api';
import bg from '../assets/backgrounds/signin.jpg';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBarber, setIsBarber] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para armazenar a mensagem de erro
  const [success, setSuccess] = useState<string | null>(null); // Para armazenar a mensagem de sucesso

  const handleRegister = async () => {
    setError(null); // Limpa mensagens de erro anteriores
    setSuccess(null); // Limpa mensagens de sucesso anteriores

    const data = {
      name,
      email,
      password,
      type: isBarber ? 'barber' : 'customer', // Define o tipo de usuário com base na checkbox
    };

    const response = await register(data);

    if ('error' in response) {
      setError(response.error);
    } else {
      setSuccess('Registration successful!'); // Sucesso
    }
  };

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
          <input
            type='text'
            placeholder='Nome'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 mb-4 bg-stone-700 text-white rounded'
          />
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
          <div className='flex items-center mb-4'>
            <input
              type='checkbox'
              checked={isBarber}
              onChange={(e) => setIsBarber(e.target.checked)}
              className='mr-2'
            />
            <label>Sou um barbeiro</label>
          </div>
          <button
            className='bg-yellow-500 text-white w-full p-2 rounded hover:bg-yellow-600'
            onClick={handleRegister}
          >
            Sign Up
          </button>
          {error && <p className='mt-4 text-red-500'>{error}</p>}  {/* Exibe mensagem de erro */}
          {success && <p className='mt-4 text-green-500'>{success}</p>}  {/* Exibe mensagem de sucesso */}
          <p className='mt-4 text-sm'>
            Já tem uma conta?{' '}
            <a href='/login' className='text-yellow-400 hover:underline'>
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
