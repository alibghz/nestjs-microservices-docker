import { Injectable, Logger } from '@nestjs/common';
import { PayOrderDto } from './dto/pay-order.dto';
import { PaymentDetailsDto } from './dto/payment-details.dto';
import { PaymentStatus } from './dto/payment-status.enum';
import { ClientOptions, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { order_host } from '../config';

const orderClient = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
        host: order_host,
        port: 8876
    }
});
let canceledPayments: string[] = []
@Injectable()
export class PaymentService {
    private readonly logger = new Logger('Payment Service');

    initiatePayment(order: PayOrderDto): string {
        var payment = new PaymentDetailsDto(order.id);

        if (order.status !== 'created')
            throw "Wrong Order Status";

        if (Math.random() * 10 >= 4)
            payment.status = PaymentStatus.Confirmed;

        // assume this is a multi step process, so when it is done we emit an event
        setTimeout(async function () {
            if (canceledPayments.find(x => x == payment.transactionId)) {
                canceledPayments = canceledPayments.filter(x => x == payment.transactionId);
                return;
            }
            orderClient.emit('paymentProcessed', payment).subscribe();
        }, Math.floor((Math.random() * 2) + 1) * 3000);

        return payment.transactionId;
    }

    cancelPayment(trxId: string) {
        canceledPayments.push(trxId);
    }
}
