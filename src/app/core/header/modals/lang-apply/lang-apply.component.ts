import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'jd-lang-apply',
  templateUrl: './lang-apply.component.html',
  styleUrls: ['./lang-apply.component.scss']
})
export class LangApplyComponent implements OnInit {
  @Output() closedApply = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onClose(){
    console.log('closedApply')
    this.closedApply.emit();
  }
  submitOn(){
    window.location.reload();
    this.closedApply.emit();
  }
  closeOn(){
    this.closedApply.emit();
  }
}
