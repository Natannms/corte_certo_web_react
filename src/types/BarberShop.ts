export type BarberShop = {
    id: number
    teamId: number
    userId: number
    role?: string
    name: string
    BarberShopUser: BarberShopUser[]
    address: string
    createdAt: Date
    updatedAt: Date
}

export type BarberShopUser = {
    id: number
    teamId: number
    role: string
    user: UserDataOnBarberShop
}

export type UserDataOnBarberShop = {
    name: string
    email: string
    profilePhotoPath: string | null
}