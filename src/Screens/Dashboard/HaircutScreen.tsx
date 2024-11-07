import { useNavigate } from 'react-router-dom';
import { useUserStore, useHairCutStore } from '../../contexts';
import { useEffect} from 'react';
import HairCutTable from '../../components/HairCutTable';
import HairCutForm from '../../components/HaircutForm';
import { ToastContainer } from 'react-toastify';
import { ArrowLeft } from '@phosphor-icons/react';

const HaircutScreen = () => {
    const { token } = useUserStore();
    const { showCreateForm, setShowCreateForm } = useHairCutStore();
    const navigate = useNavigate()
    async function loadPage() {
        if (!token) {
            localStorage.clear()
            navigate("/login")
        }
    }

    useEffect(() => {
        loadPage()
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
                <HairCutTable />
        </>
    );

}
export default HaircutScreen; 
