import { Consumption } from "./Consumption";
import { User } from "./User";

export type Schedule = {
    id: number;
    userId?: number | null;
    clientId: number;
    date: Date;
    time: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user?: User | null; // Relacionamento opcional com o usuário
    client?: User | null; // Relacionamento opcional com o cliente
    consumptions: Consumption[]; // Array de consumos relacionados
    rates: any[]; // Array de avaliações relacionadas
};
