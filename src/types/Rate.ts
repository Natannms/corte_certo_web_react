export type Rate = {
    id: number;
    userId: number;
    scheduleId: number;
    clientId: number;
    rate: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
}