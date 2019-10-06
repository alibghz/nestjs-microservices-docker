import { PaymentStatus } from "./payment-status.enum";
import { uuid } from 'uuid';
import { ApiModelProperty } from "@nestjs/swagger";
export class PaymentDetailsDto {
    constructor(orderId: String) {
        this.orderId = orderId;
        this.status = PaymentStatus.Declined;
        this.transactionId = (Math.round(Math.random() * 999999)).toString();
    }
    @ApiModelProperty()
    orderId: String;
    @ApiModelProperty()
    status: PaymentStatus;
    @ApiModelProperty()
    transactionId: String;
}