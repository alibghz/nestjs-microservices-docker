import * as mongoose from 'mongoose';
import { OrderStatus } from '../enums/order-status.enum';

export const OrderSchema = new mongoose.Schema({
  amount: Number,
  username: { type: String, default: 'mock-user' },
  status: { type: String, default: OrderStatus.Created },
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
});