import { NavigateFunction, useNavigate } from "react-router-dom";

const LPScreen = () => {  
    const navigate: NavigateFunction = useNavigate();

    return (
        <>
            LPSCREEN
            <div className='bg-lime-500 text-white rounded p-4 mt-4 text-center' onClick={()=>navigate('/login')}>Sign In</div>
            <div className='bg-lime-500 text-white rounded p-4 mt-4 text-center' onClick={()=>navigate('/register')}>Sign Up</div>
        </>
    );  

}
export default LPScreen; 
