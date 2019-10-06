import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersDataSource } from './orders-datasource';
import { OrdersService } from './orders.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderComponent } from './add-order/add-order.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { IOrder } from './order.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: false })
  sort: MatSort;

  @ViewChild(MatTable, { static: false })
  table: MatTable<IOrder>;

  constructor(
    private service: OrdersService,
    private dataSource: OrdersDataSource,
    private alert: MatSnackBar,
    public dialog: MatDialog
  ) { }

  displayedColumns = ['createdAt', 'username', 'amount', 'status', 'actions'];

  ngOnInit() {
    this.service.findAll().subscribe((data: IOrder[]) => {
      this.dataSource.data = data;
      this.table.dataSource = this.dataSource;
    });

    this.service.newOrderAdded.subscribe(order => {
      this.dataSource.data.unshift(order);
      this.table.dataSource = [];
      this.table.dataSource = this.dataSource;
      this.table.renderRows();
    });

    this.service.orderStatusUpdated.subscribe(order => {
      const data = [];
      for (const item of this.dataSource.data) {
        if (order._id === item._id)
          data.push(order);
        else
          data.push(item);
      }
      this.dataSource.data = data;
      this.table.dataSource = [];
      this.table.dataSource = this.dataSource;
      this.table.renderRows();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onCancel(id: string) {
    this.service.cancelOrder(id).subscribe(() => this.showAlert("Order canceled successfully"),
      error => {
        this.showAlert(error);
      });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(AddOrderComponent);
    try {
      dialogRef.afterClosed().subscribe(amount => {
        this.service.createOrder(amount).subscribe(() => this.showAlert("Order created successfully"),
          error => {
            this.showAlert(error);
          });
      });
    } finally { }
  }

  onView(id: string): void {
    this.service.find(id).subscribe(order => {
      this.dialog.open(ViewOrderComponent, {
        data: order,
      });
    });
  }

  showAlert(msg: string): void {
    this.alert.open(msg, '', { duration: 5000 })
  }
}
