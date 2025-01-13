import React, { useState } from "react";

type BillingType = "BOLETO" | "CREDIT_CARD" | "PIX";

interface SubscriptionProps {
  createSubscription: (billingType: BillingType) => void;
}

const SubscriptionComponent: React.FC<SubscriptionProps> = ({ createSubscription }) => {
  const [selectedBillingType, setSelectedBillingType] = useState<BillingType | null>(null);

  const handleBillingTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBillingType(event.target.value as BillingType);
  };

  const handleSubscribeClick = () => {
    if (selectedBillingType) {
      createSubscription(selectedBillingType);
    } else {
      alert("Por favor, selecione um tipo de pagamento.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 p-8 rounded-lg shadow-lg text-white max-w-sm mx-auto">
      <h2 className="text-3xl font-bold mb-4">Sua Conta de Teste Expirou!</h2>
      <p className="text-lg mb-6">
        Parece que o seu período de teste acabou, mas não se preocupe! Você pode começar agora no plano básico e
        aproveitar os recursos do nosso SaaS com um pagamento simples.
      </p>
      <div className="mb-6 w-full">
        <label htmlFor="billingType" className="block text-xl font-semibold mb-2">
          Escolha seu método de pagamento
        </label>
        <select
          id="billingType"
          value={selectedBillingType || ""}
          onChange={handleBillingTypeChange}
          className="bg-white text-black rounded-md py-2 px-4 w-full"
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="BOLETO">Boleto</option>
          <option value="CREDIT_CARD">Cartão de Crédito</option>
          <option value="PIX">PIX</option>
        </select>
      </div>
      <button
        onClick={handleSubscribeClick}
        className="bg-yellow-400 text-black py-3 px-6 rounded-lg text-xl font-semibold hover:bg-yellow-500 transition duration-300"
      >
        Iniciar Plano Básico
      </button>
    </div>
  );
};

export default SubscriptionComponent;
