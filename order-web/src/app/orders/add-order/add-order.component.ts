import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent {
  amount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<AddOrderComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
