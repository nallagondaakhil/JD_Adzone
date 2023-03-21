import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BreadCrumbModel } from './model/breadcrumb.model';

@Component({
  selector: 'jd-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  @Input() breadcrumbItems: BreadCrumbModel[];
  @Input() large: boolean;
  @Output() onClick: EventEmitter<BreadCrumbModel> = new EventEmitter<BreadCrumbModel>();
  constructor() {}

  ngOnInit(): void {}

  setValue(title: string, value: string) {
    this.onClick.emit({title, value});
  }
}
