import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderAdminViewModel } from '../../models/admin-order-view.model';

@Component({
  selector: 'jd-admin-view-order',
  templateUrl: './admin-view-order.component.html',
  styleUrls: ['./admin-view-order.component.scss']
})
export class AdminViewOrderComponent implements OnInit {
  @Input() model: OrderAdminViewModel;
  @Output() closed = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    this.model.orderOn = this.formatDate(this.model.orderOn)
    console.log(this.model)
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  onClose() {
    this.closed.emit();
  }

}
