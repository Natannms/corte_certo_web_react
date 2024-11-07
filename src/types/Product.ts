export type Product = {
    id: number;
    userId: number;
    description: string;
    name: string;
    price: number;
    quantity: number | null;
    imageName: string;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
}