import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'jd-lang-save-preference',
  templateUrl: './lang-save-preference.component.html',
  styleUrls: ['./lang-save-preference.component.scss']
})
export class LangSavePreferenceComponent implements OnInit {
  @Output() closedSave = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  onClose(){
    console.log('closedSave')
    this.closedSave.emit();
  }
  submitOn(){
    this.closedSave.emit();
    // window.location.reload();
  }
  closeOn(){
    this.closedSave.emit();
  }
}
