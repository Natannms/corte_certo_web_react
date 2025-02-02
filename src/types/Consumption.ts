import { HairCut } from "./Haircut"
import { Product } from "./Product"

export type Consumption = {
    id?:           number  
    scheduleId:   number
    productId?:    number
    hairCutId?:    number
    quantity?:     number   // Quantidade de produtos ou serviços consumidos
    createdAt?:    Date  
    updatedAt?:    Date  
    schedule?:     number
    product?:      Product
    hairCut?:      HairCut
}