import { NavigateFunction, useNavigate } from "react-router-dom";
import BarberSearchComponent from "../components/BarberSearchComponent";

const SearchBarbersScreen = () => {
    const navigate: NavigateFunction = useNavigate();

    return (
        <div className="font-sans text-gray-800">
            {/* Header */}
            <header className="bg-black text-white">
                <div className="container mx-auto flex justify-between items-center py-6 px-4 lg:px-8">
                    <div className="text-2xl font-bold">Corte Certo</div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="hover:text-yellow-500">Home</a>
                        <a href="#" className="hover:text-yellow-500">About Us</a>
                        <a href="#" className="hover:text-yellow-500">How it Works</a>
                        <a href="#" className="hover:text-yellow-500">Our Services</a>
                        <a href="#" className="hover:text-yellow-500">Contact Us</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section with Search */}
            <section className="bg-black text-white py-16 px-4 lg:px-8">
                <BarberSearchComponent />
            </section>

            {/* Rest of the sections remain the same */}
        </div>
    );
}

export default SearchBarbersScreen;