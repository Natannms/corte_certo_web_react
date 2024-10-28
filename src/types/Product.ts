export type Product = {
    id: number;
    userId: number;
    description: string;
    name: string;
    price: number;
    quantity: number | null;
    imageName: string | null;
    imageUrl: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}