import { Controller, Get, Logger, Inject, Post, Body, Param, HttpStatus, Res, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy, MessagePattern, EventPattern } from '@nestjs/microservices';
import { ORDER_SERVICE } from './order.constants';
import { Observable, Subscription, from } from 'rxjs';
import { PaymentDetailsDto } from './dto/payment-details.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrder } from './interfaces/order.interface';
import { OrderStatus } from './enums/order-status.enum';
import { Response } from 'express';
import { ApiOkResponse, ApiInternalServerErrorResponse, ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';

@Controller('orders')
@ApiUseTags('orders')
export class OrderController {
    private readonly logger = new Logger('OrderController');
    constructor(
        @Inject(ORDER_SERVICE) private readonly client: ClientProxy,
        private readonly service: OrderService
    ) { }

    @Get()
    index(): Observable<IOrder[]> {
        return from(this.service.findAll());
    }

    @Post()
    async create(@Res() res: Response, @Body() createOrderDto: CreateOrderDto) {
        if (!createOrderDto || !createOrderDto.amount || createOrderDto.amount <= 0)
            return res.status(HttpStatus.BAD_REQUEST).send();

        try {
            const order = await this.service.create(createOrderDto);
            this.client.emit('orderCreated', order.id);
            return res.status(HttpStatus.CREATED).send(order);
        } catch (error) {
            this.logger.log('error in create');
            this.logger.log(JSON.stringify(error));
            return res.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error));
        }
    }

    @Get(':id')
    @ApiImplicitParam({
        name: 'id',
        required: true,
        description: 'Order ID',
    })
    async details(@Res() res: Response, @Param('id') id: string) {
        if (!id)
            return res.status(HttpStatus.BAD_REQUEST).send();

        const order = await this.service.findById(id);
        if (!order)
            return res.status(HttpStatus.NOT_FOUND).send();

        return res.send(order);
    }

    @Get(':id/status')
    @ApiImplicitParam({
        name: 'id',
        required: true,
        description: 'Order ID',
    })
    async status(@Res() res: Response, @Param('id') id: string) {
        if (!id)
            return res.status(HttpStatus.BAD_REQUEST).send();

        const order = await this.service.findById(id);
        if (!order)
            return res.status(HttpStatus.NOT_FOUND).send();

        return res.send(order.status);
    }

    @Post(':id/cancel')
    @ApiImplicitParam({
        name: 'id',
        required: true,
        description: 'Order ID',
    })
    async cancel(@Res() res: Response, @Param('id') id: string) {
        try {
            const order = await this.service.cancel(id);
            return res.send(order);
        } catch (error) {
            this.logger.log(error);
            return res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @EventPattern('orderCreated')
    async orderCreated(id: string) {
        await this.service.initiatePayment(id);
    }

    @EventPattern('paymentProcessed')
    async paymentProcessed(data: PaymentDetailsDto) {
        const order = await this.service.updatePaymentStatus(data);

        if (order && order.status == OrderStatus.Confirmed)
            this.client.emit('orderConfirmed', order.id);
    }

    @EventPattern('orderConfirmed')
    async orderConfirmed(id: string) {
        await this.service.deliver(id);
    }
}
