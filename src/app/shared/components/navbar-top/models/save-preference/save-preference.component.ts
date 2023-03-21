import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jd-save-preference',
  templateUrl: './save-preference.component.html',
  styleUrls: ['./save-preference.component.scss']
})
export class SavePreferenceComponent implements OnInit {
  @Output() closedSave = new EventEmitter();
  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
  }
  onClose(){
    console.log('closedSave')
    // window.location.reload();

    this.closedSave.emit();
  }
  submitOn(){
    this.closedSave.emit();
    window.location.reload();
  }
  closeOn(){
    this.closedSave.emit();
    // window.location.reload();

  }
}
