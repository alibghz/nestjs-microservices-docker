import { IOrder } from "../interfaces/order.interface";
import { ApiModelProperty } from "@nestjs/swagger";

export class PayOrderDto {
    constructor(order: IOrder) {
        this.id = order.id;
        this.amount = order.amount;
        this.status = order.status;
        this.username = order.username;
    }
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    amount: number;
    @ApiModelProperty()
    status: string;
    @ApiModelProperty()
    username: string;
}