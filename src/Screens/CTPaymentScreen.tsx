import { NavigateFunction, useNavigate } from "react-router-dom";
import imageHero from '../assets/images/hero.png'
import SubscriptionComponent from "../components/SubscriptionComponent";
import { createSubscription } from "../../src/api/api";
import { useUserStore } from "../contexts/index";

const CTPaymentScreen = () => {
    const { token } = useUserStore()

    const navigate: NavigateFunction = useNavigate();
    const startSubscription = async (billingType: "BOLETO" | "CREDIT_CARD" | "PIX") => {
       try {
        const subs = await createSubscription(billingType, token)
        console.log(subs);
       } catch (error) {
        console.log(error);
       }

      };
    return (
        <>
            <div className="font-sans text-gray-800">
                {/* Header */}
                <header className="bg-black text-white">
                    <div className="container mx-auto flex justify-between items-center py-6 px-4 lg:px-8">
                        {/* Logo */}
                        <div className="text-2xl font-bold">Corte Certo</div>
                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <a href="#" className="hover:text-yellow-500">Home</a>
                            <a href="#" className="hover:text-yellow-500">About Us</a>
                            <a href="#" className="hover:text-yellow-500">How it Works</a>
                            <a href="#" className="hover:text-yellow-500">Our Services</a>
                            <a href="#" className="hover:text-yellow-500">Contact Us</a>
                        </nav>
                        {/* Contact Button */}
                     
                    </div>
                </header>

                {/* Hero Section */}
                <section className="bg-black text-white pt-12 px-4 lg:px-8">
                    <div className="container mx-auto flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 space-y-6">
                            <SubscriptionComponent createSubscription={startSubscription} />
                        </div>
                        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
                            <img src={imageHero} alt="Visual Financeiro" className="w-full max-w-md rounded-lg" />
                        </div>
                    </div>
                </section>

                {/* Our Firm Section */}
                <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 bg-white">
                    {/* Left Side - Text Content */}
                    <div className="md:w-1/2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quem Somos</h2>
                        <h3 className="text-3xl font-bold text-orange-500 leading-snug mb-6">
                            Estamos aqui para revolucionar a gestão da sua barbearia
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Nossa missão é ajudar barbeiros a alcançar o próximo nível de produtividade e organização. Com soluções modernas e práticas, você pode focar no que realmente importa: o atendimento ao cliente e o crescimento do seu negócio.
                        </p>
                        <p className="text-gray-600 mb-6">
                            Com tecnologia de ponta e uma equipe dedicada, garantimos que sua barbearia esteja sempre à frente, com ferramentas que tornam a gestão mais simples, eficiente e lucrativa.
                        </p>
                        <button onClick={() => navigate("/cadastre-se")} className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition">
                            Iniciar gratuitamente
                        </button>
                    </div>

                    {/* Right Side - Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-10 md:mt-0 md:w-1/2">
                        <div className="bg-gray-100 rounded-l-full rounded-br-full p-6 text-center shadow-md">
                            <p className="text-2xl font-bold text-gray-800">18</p>
                            <p className="text-sm text-gray-500">Anos de Experiência</p>
                        </div>
                        <div className="bg-gray-100 rounded-r-full rounded-tl-full p-6 text-center shadow-md">
                            <p className="text-2xl font-bold text-gray-800">150+</p>
                            <p className="text-sm text-gray-500">Novas franquias</p>
                        </div>
                        <div className="bg-gray-100 rounded-l-full rounded-br-full p-6 text-center shadow-md">
                            <p className="text-2xl font-bold text-gray-800">450</p>
                            <p className="text-sm text-gray-500">Barbearias novas</p>
                        </div>
                        <div className="bg-gray-100 rounded-r-full rounded-tl-full p-6 text-center shadow-md">
                            <p className="text-2xl font-bold text-gray-800">4000/mês</p>
                            <p className="text-sm text-gray-500">Clientes Atendidos</p>
                        </div>
                    </div>
                </section>

                {/* Our Services Section */}
                <section className="px-6 md:px-16 py-12 bg-white text-center">
                    {/* Section Title */}
                    <div className="mb-12">
                        <h2 className="text-lg font-semibold text-gray-800">Nossos Serviços</h2>
                        <h3 className="text-3xl font-bold text-orange-500">Transforme sua Barbearia com Nossas Soluções</h3>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
                            <div className="bg-gradient-to-b from-purple-100 to-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                {/* Icon Placeholder */}
                                <span role="img" aria-label="icon" className="text-2xl">💼</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Controle Financeiro Completo</h4>
                            <p className="text-sm text-gray-500">
                                Tenha uma visão clara de todas as suas finanças. Com relatórios detalhados, você gerencia receitas, despesas e lucros de forma simples e eficaz.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
                            <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                {/* Icon Placeholder */}
                                <span role="img" aria-label="icon" className="text-2xl">📈</span>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Gestão de Agendamentos</h4>
                            <p className="text-sm text-gray-400">
                                Organize os horários de seus clientes de forma eficiente, evitando conflitos de agenda e oferecendo uma experiência de atendimento excepcional.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
                            <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                {/* Icon Placeholder */}
                                <span role="img" aria-label="icon" className="text-2xl">📊</span>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Relatórios de Desempenho</h4>
                            <p className="text-sm text-gray-400">
                                Acompanhe o desempenho da sua barbearia com relatórios detalhados sobre vendas, serviços e feedback dos clientes, para tomar decisões mais assertivas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Latest News Section */}
                <section className="bg-gray-100 text-gray-800 py-16 px-4 lg:px-8">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Fique Por Dentro</h2>
                        <h3 className="text-2xl font-semibold text-gray-900">Últimas Notícias e Dicas para Barbeiros</h3>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                "https://images.unsplash.com/photo-1672642150048-fbfa1634804f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                "https://images.unsplash.com/photo-1686671805337-7d8aa64b965f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            ].map((item, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                                    <img src={item} alt="Notícia" className="w-full h-48 object-cover rounded-md" />
                                    {index === 0 && (
                                        <>
                                            <h4 className="text-xl font-bold mt-4">Como Maximizar o Lucro da Sua Barbearia</h4>
                                            <p className="text-gray-600 mt-2">
                                                Descubra estratégias comprovadas para aumentar as suas vendas e melhorar a experiência do cliente na sua barbearia.
                                            </p>
                                        </>
                                    )}
                                    {index === 1 && (
                                        <>
                                            <h4 className="text-xl font-bold mt-4">Dicas de Gestão de Estoque para Barbearias</h4>
                                            <p className="text-gray-600 mt-2">
                                                Saiba como otimizar o controle de produtos, evitando desperdícios e garantindo que você tenha sempre o que seu cliente precisa.
                                            </p>
                                        </>
                                    )}
                                    {index === 2 && (
                                        <>
                                            <h4 className="text-xl font-bold mt-4">Melhore o Atendimento e Fidelize Seus Clientes</h4>
                                            <p className="text-gray-600 mt-2">
                                                Aprenda técnicas de atendimento que fazem a diferença e como fidelizar seus clientes para garantir retorno constante.
                                            </p>
                                        </>
                                    )}
                                    <a href="#" className="text-yellow-500 mt-4 block">Leia Mais e Fique Atualizado</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-black text-white py-16 px-4 lg:px-8 text-center">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-semibold">Pronto para Transformar sua Barbearia?</h2>
                        <h3 className="text-4xl font-bold mb-8">Vamos Criar Juntos o Futuro da Sua Empresa</h3>
                        <button onClick={() => navigate("/register")} className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600">
                            Comece agora
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-400 py-8">
                    <div className="container mx-auto text-center space-y-4">
                        <div className="text-white text-xl font-bold">Corte Certo</div>
                        <p>Conte com a melhor equipe para ajudar sua barbearia a alcançar novos patamares. Estamos prontos para ajudar você!</p>
                        <p className="text-sm">&copy; {new Date().getFullYear()} Corte Certo. Todos os direitos reservados.</p>
                    </div>
                </footer>
            </div>
        </>
    );

}
export default CTPaymentScreen; 
