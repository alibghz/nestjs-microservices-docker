import { OrderStatus } from "../enums/order-status.enum";
import { Document } from 'mongoose';

export interface IOrder  extends Document{
    amount: number;
    username: string;
    status: OrderStatus;
    transactionId: string;
    createdAt: Date;
}