import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { IOrder } from './order.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly api_root: string = `${environment.api_protocol}${environment.api_host}:${environment.api_port}/api/orders`;
  newOrderAdded = this.socket.fromEvent<IOrder>('newOrderAdded');
  orderStatusUpdated = this.socket.fromEvent<IOrder>('orderStatusUpdated');

  constructor(
    private http: HttpClient,
    private socket: Socket,
  ) { }

  findAll() {
    return this.http.get<IOrder[]>(this.api_root);
  }

  find(id: string) {
    if (!id) return;
    return this.http.get<IOrder>(this.api_root + '/' + id)
  }

  createOrder(amount: number) {
    if (!amount) return;
    return this.http.post<IOrder>(this.api_root, { amount });
  }

  cancelOrder(id: string) {
    const confirmed = confirm("Are you sure to cancel this order?");
    if (!confirmed) return;
    return this.http.post<IOrder>(this.api_root + "/" + id + "/cancel", id);
  }
}
