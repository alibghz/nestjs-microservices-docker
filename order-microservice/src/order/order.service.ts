import { Injectable, Logger } from '@nestjs/common';
import { ClientOptions, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { PaymentDetailsDto } from './dto/payment-details.dto';
import { PaymentStatus } from './dto/payment-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrder } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { PayOrderDto } from './dto/pay-order.dto';
import { payment_host } from '../config';
import { OrderGateway } from './order.gateway';

@Injectable()
export class OrderService {
    private readonly logger = new Logger('OrderService');

    private readonly paymentClient = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
            host: payment_host,
            port: 8875
        }
    });

    constructor(
        @InjectModel('Order') private readonly model: Model<IOrder>,
        private readonly webSocket: OrderGateway
    ) {
    }

    async findAll(): Promise<IOrder[]> {
        return await this.model.find().sort({ createdAt: 'descending' }).exec();
    }

    async findById(id: string) {
        return await this.model.findById(id);
    }

    async create(createOrderDto: CreateOrderDto): Promise<IOrder> {
        const order = new this.model(createOrderDto);
        this.webSocket.newOrderAdded(order);
        return await order.save();
    }

    async initiatePayment(id: String) {
        const order = await this.model.findById(id);
        this.paymentClient.send('initiatePayment', new PayOrderDto(order)).subscribe(async (trxId) => {
            order.transactionId = trxId;
            await order.save()
        });
    }

    async updatePaymentStatus(data: PaymentDetailsDto): Promise<IOrder> {
        const order = await this.model.findById(data.orderId);

        if (!order || order.status !== OrderStatus.Created) return;

        switch (data.status) {
            case PaymentStatus.Confirmed:
                order.status = OrderStatus.Confirmed;
                break;
            case PaymentStatus.Declined:
                order.status = OrderStatus.Canceled;
                break;

            default:
                break;
        }
        this.webSocket.orderStatusUpdated(order);
        return await order.save();
    }

    async cancel(id: string): Promise<IOrder> {
        const order = await this.model.findById(id);
        switch (order.status) {
            case OrderStatus.Confirmed:
            case OrderStatus.Created:
                order.status = OrderStatus.Canceled;
                this.paymentClient.emit('paymentCanceled', order.transactionId);
                this.webSocket.orderStatusUpdated(order);
                break;

            default:
                throw "Cannot cancel due to wrong status";
        }
        return await order.save();
    }

    async deliver(id: string) {
        const wss = this.webSocket;
        const model = this.model;
        setTimeout(async function () {
            const order = await model.findById(id);

            if (order.status !== OrderStatus.Confirmed)
                throw "Cannot deliver due to wrong status";

            order.status = OrderStatus.Delivered;
            wss.orderStatusUpdated(order);
            await order.save();
        }, Math.floor((Math.random() * 3) + 1) * 3000);
    }
}
