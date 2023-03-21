import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jd-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  @Output() closedApply = new EventEmitter();

  constructor(
    public translate:TranslateService
  ) { }

  ngOnInit(): void {
  }
  onClose(){
    // window.location.reload();
    console.log('closedApply')
    this.closedApply.emit();
  }
  submitOn(){
    window.location.reload();
    this.closedApply.emit();
  }
  closeOn(){
    // window.location.reload();
    this.closedApply.emit();
  }
}
