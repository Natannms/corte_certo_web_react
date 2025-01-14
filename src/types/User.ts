import { BarberShop } from "./BarberShop"

export type User = {
    id: number
    teamId: number
    userId: number
    role?: string
    createdAt: Date
    updatedAt: Date
    barberShop: BarberShop
}

export type Configs = {
    type: string;
    message: string
  }
