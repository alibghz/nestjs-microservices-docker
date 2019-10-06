import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { IOrder } from './interfaces/order.interface';

@WebSocketGateway()
export class OrderGateway {
  private readonly logger = new Logger('OrderGateway');

  @WebSocketServer() 
  wss: Server;

  newOrderAdded(payload: IOrder): void {
    this.wss.emit('newOrderAdded', payload);
  }

  orderStatusUpdated(payload: IOrder): void {
    this.wss.emit('orderStatusUpdated', payload);
  }
}
