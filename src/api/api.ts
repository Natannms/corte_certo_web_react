// import { HairCut } from "src/types/Haircut";
import { HairCut } from "src/types/Haircut";
import { HairCutPaginated, RatesPaginated, SchedulesPaginated } from "src/types/Paginated";
import { Schedule } from "src/types/Schedule";

const isProd = false;
const API_BASE_URL = isProd ? 'https://corte-certo-backend-typescript.onrender.com' : 'http://localhost:8080';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    type: string; // Ou outro campo necessário para o registro
}

interface ErrorResponse {
    error: string;
    message?: string;
    expiredToken? : boolean;
}

export type AuthResponse = {
    error? : string;
    token? : string;
    user?: {
        name: string;
        email: string;
        type: string;
        id: number;
        profilePhotoPath: string;
        createdAt: string;
        updatedAt: string;
    }
}

export type HairCutResponse = {
    error?: string;
    message?: string;
    data?: HairCut
}

export async function login(data: LoginData): Promise<AuthResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return { error: `Failed to login: ${errorMessage}` };
        }
        return response.json();
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };

    }
}

export async function register(data: RegisterData): Promise<Response | ErrorResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorMessage = await response.text();
            return { error: `Failed to register: ${errorMessage}` };
        }

        return response;
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };

    }
}
export async function createHaircut(data: FormData, token:string): Promise<HairCutResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/haircuts`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
            },
            body: data,
        });
        
        if (!response.ok) {
            const errorMessage = await response.text();
            return { error: `Failed to register new service : ${errorMessage}` };
        }   

        const result = await response.json()
        
        return {data: result, message:"Criado com suceso !"};
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };

    }
}

export async function getHaircuts(token: string): Promise<HairCutPaginated> {
    try {
        
        const response = await fetch(`${API_BASE_URL}/haircuts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const err = await response.json();
            err.error = `Failed to get haircuts: ${err.message}`;
            return err
        }

        const data = await response.json();                
        return data;
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}`, data: [], total: 0, totalPages: 0 };
    }
}

export async function getSchedules(token: string): Promise<SchedulesPaginated> {
    try {
        const response = await fetch(`${API_BASE_URL}/schedules`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });        

        if (!response.ok) {
            const err = await response.json();
            err.error = `Failed to get schedules: ${err.message}`;
            return err;
        }
        const data = await response.json();        
        return data;
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}`, data: [], total: 0, totalPages: 0 };

    }
}
export async function getRates(token: string): Promise<RatesPaginated> {
    try {
        const response = await fetch(`${API_BASE_URL}/rates`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const err = await response.json();
            err.error = `Failed to get rates: ${err.message}`;
            return err;
        }
        const data = await response.json();        
        return data;
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}`, data: [], total: 0, totalPages: 0 };
    }
}

export async function updateSchedule(token: string, scheduleId: number, data: Partial<Schedule>): Promise<{ success: boolean; error?: string } | ErrorResponse> {
    console.log(data);
    
    try {
        const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.json();
            return { success: false, error: `Failed to update schedule status: ${err.message}` };
        }

        return { success: true };
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };

    }
}


