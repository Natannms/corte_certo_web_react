import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createColab } from '../../src/api/api';
import { toast, ToastContainer } from 'react-toastify';

const AcceptInviteColabScreen = () => {
    const [token, setToken] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const location = useLocation();
    const [loading, setLoading] =  useState(false)
    useEffect(() => {
        // Extrai os parâmetros da URL
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        const unitFromUrl = queryParams.get('unit');

        // Seta os valores na variável de estado
        if (tokenFromUrl) setToken(tokenFromUrl);
        if (unitFromUrl) setUnit(unitFromUrl);
    }, [location]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault();

        // Cria o objeto com os dados
        const colabData = {
            name,
            email,
            password,
            token,
            unit,
        };

        // Chama o método createColab com os dados
        const register = await createColab(colabData);
        if(register.data && register.data.success){
            setLoading(false)
            toast(register.data.success, {type: 'success'})
        }else{
            setLoading(false)
            toast(register.error, {type: 'error'})
        }
        setLoading(false)
    };


    return (
        <div className="bg-gray-800 text-white w-full h-screen flex flex-row">
        <ToastContainer />
            <div
                className="bg-zinc-800 p-4 w-6/12 bg-cover"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1596362601603-b74f6ef166e4?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
            ></div>

            <form onSubmit={handleSubmit} className="bg-stone-800 p-8 w-full flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-8">Barber Shop App</h1>
                <div className="w-8/12">
                    <input
                        required
                        name="name"
                        type="text"
                        placeholder="Nome"
                        className="w-full p-2 mb-4 bg-stone-700 text-black rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        required
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 mb-4 bg-stone-700 text-black rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        required
                        name="password"
                        type="password"
                        placeholder="Senha"
                        className="w-full p-2 mb-4 bg-stone-700 text-black rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {!loading && <button type="submit" className="bg-yellow-500 text-black w-full p-2 rounded hover:bg-yellow-600">
                        Cadastrar
                    </button>}
                    {loading &&
                        <div className="spinner-circle"></div>
                    }
                </div>
            </form>
        </div>
    );
};

export default AcceptInviteColabScreen;
