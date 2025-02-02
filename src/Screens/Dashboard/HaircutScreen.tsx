import { useNavigate } from 'react-router-dom';
import { useUserStore, useHairCutStore } from '../../contexts';
import { useEffect, useState} from 'react';
import HairCutTable from '../../components/HairCutTable';
import HairCutForm from '../../components/HaircutForm';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeft } from '@phosphor-icons/react';
import { getHaircuts } from '../../api/api';

const HaircutScreen = () => {
    const { token, configs } = useUserStore();
    const { showCreateForm, setShowCreateForm , setHaircuts} = useHairCutStore();
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    async function loadPage() {
        if (!token) {
            localStorage.clear()
            navigate("/login")
        }
    }
    async function updateTable() {
        setIsLoading(true);
        const newConfigs = configs
        // Carregar Haircuts
        const haircutResult = await getHaircuts(token);
        if (haircutResult.error) {
            toast(haircutResult.error);

            if (haircutResult.expiredToken) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
            setIsLoading(false);
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
            setIsLoading(false)
        }

    }
    useEffect(() => {
        loadPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <ToastContainer />
            {showCreateForm &&
                <div className='p-10 bg-black/50 h-screen w-full absolute z-50 flex items-center justify-center'>
                    <HairCutForm />
                </div>
            }
               <div className="w-full p-6 flex items-center justify-between">
                    <button className='btn bg-zinc-500 flex gap-4' onClick={()=>navigate("/dashboard")}><ArrowLeft size={24} color='white' /> Voltar</button>
                    <button onClick={()=>setShowCreateForm()} className="btn btn-primary">Novo Serviço</button>
                </div>
                {isLoading ?
                    <div className="skeleton h-24"></div>
                    :
                    <HairCutTable updateTable={updateTable}/>
                }
        </>
    );

}
export default HaircutScreen; 
