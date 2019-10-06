import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [{
  path: 'orders',
  component: OrdersComponent,
  data: { title: 'List of orders' }
}, {
  path: '',
  component: DashboardComponent,
  data: { title: 'Dashboard' }
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
