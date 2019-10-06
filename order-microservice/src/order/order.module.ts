import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE } from './order.constants';
import { order_host } from '../config';
import { OrderGateway } from './order.gateway';

@Module({
  imports: [
    ClientsModule.register([{
      name: ORDER_SERVICE, transport: Transport.TCP, options: {
        host: order_host,
        port: 8876
      }
    }]),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])
  ],
  providers: [
    OrderService,
    OrderGateway
  ],
  controllers: [OrderController]
})
export class OrderModule { }
