// import { HairCut } from "src/types/Haircut";
import { HairCut } from "src/types/Haircut";
import { BarberShopPaginated, HairCutPaginated, ProductPaginated, RatesPaginated, SchedulesPaginated } from "src/types/Paginated";
import { Product } from "src/types/Product";
import { Schedule } from "src/types/Schedule";

// const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL; 
const API_BASE_URL =  "https://cortecertots-536925599617.us-east4.run.app"; 

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    type: string;
    cpfCnpj: string;
    address: string;
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
export type ProductResponse = {
    error?: string;
    message?: string;
    data?: Product
}
export type CrateColabResponse = {
    error?: string;
    message?: string;
    data?: any
}

export type CreateColabData = {
    name: string;
    email: string;
    password: string;
    token: string;
    unit: string;
}

export type DefaultResponse = {
    error?: string;
    message?: string
}
interface BarberShopUpdateData {
    name?: string;
    address?: string;
    startWorkTime?: string; // formato de data/hora ISO
    endWorkTime?: string;   // formato de data/hora ISO
}

interface UpdateResponse {
    success?: boolean;
    error?: string;
    data?: any;
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
            const errorMessage = await response.json();
            return { error: `Failed to login: ${errorMessage.error}` };
        }
        return await response.json();
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
            const errorMessage = await response.json();
            return { error: `Failed to register: ${errorMessage}` };
        }

        return response;
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };

    }
}
export async function deleteUser(id: number, token:string): Promise<DefaultResponse | ErrorResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorMessage = await response.json();
            console.log(errorMessage)
            return { error: `Failed to delete: ${errorMessage}` };
        }

        return {message: "Deletado com sucesso !"};
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
            const errorMessage = await response.json();
            return { error: `Failed to register new service : ${errorMessage}` };
        }   

        const result = await response.json()
        
        return {data: result, message:"Criado com suceso !"};
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };

    }
}
export async function createProduct(data: FormData, token:string): Promise<ProductResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
            },
            body: data,
        });
        
        if (!response.ok) {
            const errorMessage = await response.json();
            return { error: `Failed to register new service : ${errorMessage}` };
        }   

        const result = await response.json()
        
        return {data: result, message:"Criado com suceso !"};
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };

    }
}
export async function createColab(data: CreateColabData): Promise<CrateColabResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/create-colab`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorMessage = await response.json();
            console.log(errorMessage);
            
            return { error: errorMessage.error };
        }   

        const result = await response.json()
        
        return {data: result, message:"Criado com suceso !"};
    } catch (error) {
        console.log(error);
        
        return { error: `Network error: ${(error as Error).message}` };

    }
}
export async function inviteColaborator(email: string, token:string, barberShopId:string): Promise<ProductResponse> {   

    try {
        const response = await fetch(`${API_BASE_URL}/invite/colaborator`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({email, barberShopId: Number(barberShopId)}),
        });
        
        if (!response.ok) {
            const errorMessage = await response.json();
            return { error: `Failed to register  : ${errorMessage}` };
        }   

        const result = await response.json()
        
        return {data: result, message:"Enviado com sucesso !"};
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

export async function getBarberShops(token: string): Promise<BarberShopPaginated> {
    try {
        
        const response = await fetch(`${API_BASE_URL}/barbershop`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const err = await response.json();
            err.error = `Failed to get barbershop: ${err.message}`;
            return err
        }

        const data = await response.json();   
        
        return {data, total: 0, totalPages: 0};
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}`, data: [], total: 0, totalPages: 0 };
    }
}

export async function getProducts(token: string): Promise<ProductPaginated> {
    try {
        
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const err = await response.json();
            err.error = `Failed to get products: ${err.message}`;
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

export async function updateBarberShop(
    token: string, 
    barberShopId: number, 
    updateData: BarberShopUpdateData
): Promise<UpdateResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/barbershop/${barberShopId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const err = await response.json();
            return { error: `Failed to update barber shop: ${err.message}` };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: `Network error: ${(error as Error).message}` };
    }
}

