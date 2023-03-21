import { DropdownMenuItem } from './../../models/dropdown.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'jd-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() menu: DropdownMenuItem[];
  @Input() label: string;
  @Input() btnType = 'button';  // 'button || 'link'
  @Input() isInNav = false;
  @Output() menuClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  menuSelect(menu: any) {
    this.menuClick.emit(menu);
  }

}
