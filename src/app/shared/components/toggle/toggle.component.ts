import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jd-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {

  @Input() label: string;
  @Input() toggle = false;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  onToggle() {
    this.toggle = !this.toggle;
    this.toggleChange.emit(this.toggle);
  }

}
