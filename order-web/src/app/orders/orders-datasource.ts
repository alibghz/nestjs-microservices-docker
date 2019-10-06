import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Injectable } from '@angular/core';
import { IOrder } from './order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersDataSource extends DataSource<IOrder> {
  data: IOrder[] = [];
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  connect(): Observable<IOrder[]> {
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  disconnect() { }

  private getPagedData(data: IOrder[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: IOrder[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'createdAt': return compare(a.createdAt, b.createdAt, isAsc);
        case 'amount': return compare(a.amount, b.amount, isAsc);
        case 'id': return compare(+a._id, +b._id, isAsc);
        case 'transactionId': return compare(a.transactionId, b.transactionId, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        case 'username': return compare(a.username, b.username, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
