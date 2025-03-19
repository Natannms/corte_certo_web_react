import { useState } from 'react';
import { register } from '../api/api';
import bg from '../assets/backgrounds/signin.jpg';
import logo from '../assets/logos/logo1.png'

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpfCnpj, setCpfcnpj] = useState('');
  const [address, setAddress] = useState('');
  const [isBarber, setIsBarber] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    setIsLoading(true);
    setError("");
    setSuccess(null);

    const data = {
      name,
      email,
      password,
      type: isBarber ? 'barber' : 'customer',
      cpfCnpj,
      address
    };

    const hasEmptyField = Object.values(data).some(value => value === '' || value === null || value === undefined);
    if (hasEmptyField) {
      setError("Um ou mais campos estão vazios.");
      setIsLoading(false);
    } else {
      const response = await register(data);

      if ('error' in response) {
        setError(response.error);
      } else {
        setSuccess('Cadastro realizado com sucesso!');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-stone-800 text-white w-full min-h-screen flex flex-col md:flex-row'>
      <div
        className='hidden md:block md:w-6/12 bg-stone-600 p-4'
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className='bg-stone-800 p-8 w-full flex flex-col justify-center items-center gap-10'>
        <div className="justify-center items-center flex-col">
          <h1 className="text-4xl sm:text-4xl font-bold mb-6 sm:mb-8">Corte Certo</h1>
          <img src={logo} className='w-56' alt="logo escrito corte certo" />
        </div>

        <div className='w-full max-w-md'>
          <input
            required
            type='text'
            placeholder='Nome'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 mb-4 bg-stone-700 text-white rounded'
          />
          <input
            required
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 mb-4 bg-stone-700 text-white rounded'
          />
          <input
            required
            type='text'
            placeholder='CPF/CNPJ'
            value={cpfCnpj}
            onChange={(e) => setCpfcnpj(e.target.value)}
            className='w-full p-2 mb-4 bg-stone-700 text-white rounded'
          />
          <input
            required
            type='text'
            placeholder='Endereço'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='w-full p-2 mb-4 bg-stone-700 text-white rounded'
          />
          <input
            required
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
            className='bg-yellow-500 text-white w-full p-2 rounded hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50'
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? <div className='spinner-circle'></div> : `Sign Up`}
          </button>
          {error && <p className='mt-4 text-red-500'>{error}</p>}
          {success && <p className='mt-4 text-green-500'>{success}</p>}
          <p className='mt-4 text-sm text-center'>
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
