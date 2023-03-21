import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'jd-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.scss']
})
export class ShowImageComponent implements OnInit {
  @Input() model: any;
  @Output() closed = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    this.model = this.model || {} as any;
    console.log(this.model)
  }
  onClose(){
    this.closed.emit();
  }

}
