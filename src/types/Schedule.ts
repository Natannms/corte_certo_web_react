import { Consumption } from "./Consumption";
import { User } from "./User";
// Tipos base
type BaseEntity = {
    id: number;
    createdAt: string;
    updatedAt: string;
  };
  
  // Tipo para dados de usuário
  type User = BaseEntity & {
    name: string;
    email: string;
    phone: string;
    type: 'barber' | 'client' | string;
    profilePhotoPath: string | null;
    emailVerifiedAt: string | null;
    currentTeamId: number | null;
    // Dados de pagamento/assinatura
    customerId: string | null;
    subscriptionId: string | null;
    subs_status: string | null;
    subs_expired_date: string | null;
    // Dados bancários
    bankSlipUrl: string | null;
    invoiceUrl: string | null;
  };
  
  // Tipo para consumo
  type Consumption = BaseEntity & {
    scheduleId: number;
    productId: number;
    quantity: number;
    price: number;
  };
  
  // Tipo para avaliação
  type Rate = BaseEntity & {
    scheduleId: number;
    userId: number;
    rating: number;
    comment: string;
  };
  
  // Tipo principal do agendamento
  export type Schedule = BaseEntity & {
    // Relacionamentos principais
    userId: number | null;
    barberShopId: number | null;
    clientId: number | null;
    
    // Dados do agendamento
    date: string;          // ISO String
    time: string;          // ISO String
    status: 'confirmed' | 'canceled' | 'in-progress' | 'completed' | string;
    
    // Relacionamentos
    user?: User | null;    // Barbeiro
    client?: User | null;  // Cliente
    consumptions: Consumption[];
    rates: Rate[];
  };
