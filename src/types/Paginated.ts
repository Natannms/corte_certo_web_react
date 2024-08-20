import { HairCut } from "./Haircut"
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