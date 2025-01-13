import { BarberShop } from "./BarberShop"
import { HairCut } from "./Haircut"
import { Product } from "./Product"
import { Rate } from "./Rate"
import { Schedule } from "./Schedule"

export type Paginated = {
    data: any[],
    total: number,
    totalPages: number
}


export type HairCutPaginated = {
    data: HairCut[],
    total: number,
    totalPages: number
    error?: string
    expiredToken?: any
}

export type UnscheduledBarbers = { id: number, name: string, profilePhotoPath: string | null }
export type AvailableTimesPaginated = {
    data: {
        unscheduledBarbersList?: UnscheduledBarbers[];
        availableTimes: string[];
        defaultAttendant: number;
    };
    total: number;
    totalPages: number;
    error?: string;
    expiredToken?: any;
};

export type BarberShopPaginated = {
    data: BarberShop[],
    total: number,
    totalPages: number
    error?: string
    expiredToken?: any
}
export type ProductPaginated = {
    data: Product[],
    total: number,
    totalPages: number
    error?: string
    expiredToken?: any
}
export type SchedulesPaginated = {
    data: Schedule[],
    total: number,
    totalPages: number
    error?: string
    expiredToken?: any
}
export type RatesPaginated = {
    data: Rate[],
    total: number,
    totalPages: number
    error?: string
    expiredToken?: any
}