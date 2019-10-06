export interface IOrder {
    _id: string;
    amount: number;
    status: string;
    username: string;
    transactionId: string;
    createdAt: Date;
}