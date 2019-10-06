import { Controller, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { PayOrderDto } from './dto/pay-order.dto';

@Controller('api/payment')
export class PaymentController {
    private logger = new Logger('PaymentController');

    constructor(private readonly service: PaymentService) { }

    @MessagePattern('initiatePayment')
    async initiatePayment(order: PayOrderDto): Promise<string> {
        return this.service.initiatePayment(order);
    }

    @EventPattern('paymentCanceled')
    async paymentCanceled(trxId: string) {
        this.service.cancelPayment(trxId);
    }
}
