import { useNavigate } from 'react-router-dom';
import { useUserStore, useProductStore } from '../../contexts';
import { useEffect} from 'react';
import { ToastContainer } from 'react-toastify';
import ProductForm from '../../components/ProductForm';
import ProductTable from '../../components/ProductTable';
import { ArrowLeft } from '@phosphor-icons/react';

const ProductScreen = () => {
    const { token } = useUserStore();
    const { showCreateForm, setShowCreateForm } = useProductStore();
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
                    <ProductForm />
                </div>
            }
                <div className="w-full p-6 flex items-center justify-between">
                    <button className='btn bg-zinc-500 flex gap-4' onClick={()=>navigate("/dashboard")}><ArrowLeft size={24} color='white' /> Voltare</button>
                    <button onClick={()=>setShowCreateForm()} className="btn btn-primary">Novo produto</button>
                </div>
                <ProductTable />
        </>
    );

}
export default ProductScreen; 
