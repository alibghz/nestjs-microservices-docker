import { OrderStatus } from "../enums/order-status.enum";
import { ApiModelProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @ApiModelProperty()
    amount: number;
}