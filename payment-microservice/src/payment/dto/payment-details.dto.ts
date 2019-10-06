import { PaymentStatus } from "./payment-status.enum";
import { uuid } from 'uuid';
export class PaymentDetailsDto {
    constructor(orderId: string) {
        this.orderId = orderId;
        this.status = PaymentStatus.Declined;
        this.transactionId = (Math.round(Math.random() * 999999)).toString();
    }
    orderId: string;
    status: PaymentStatus;
    transactionId: string;
}