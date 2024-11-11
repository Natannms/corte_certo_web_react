import { useNavigate } from 'react-router-dom';
import { useUserStore, useBarberShopStore } from '../../contexts';
import { useEffect} from 'react';
import { ToastContainer } from 'react-toastify';
import { ArrowLeft } from '@phosphor-icons/react';
import BarberShopTable from '../../components/BarberShopTable';
import AddColaboratorForm from '../../components/AddColaboratorForm';

const BarberShopScreen = () => {
    const { token } = useUserStore();
    const { ShowAddColaboratorForm, setShowCreateForm, setShowAddColaboratorForm } = useBarberShopStore();
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
            {ShowAddColaboratorForm &&
                <div className='p-10 bg-black/50 h-screen w-full absolute z-50 flex items-center justify-center'>
                    <AddColaboratorForm />
                </div>
            }
               <div className="w-full p-6 flex items-center justify-between">
                    <button className='btn bg-zinc-500 flex gap-4' onClick={()=>navigate("/dashboard")}><ArrowLeft size={24} color='white' /> Voltar</button>
                    <button onClick={()=>setShowCreateForm()} className="btn btn-primary">Nova unidade</button>
                    <button onClick={()=>setShowAddColaboratorForm()} className="btn btn-secondary">Novo Colaborador</button>
                </div>
                <BarberShopTable />
        </>
    );

}
export default BarberShopScreen; 
