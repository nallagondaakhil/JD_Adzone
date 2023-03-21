import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { TemplatesService } from '../../../services/templates.service';

@Component({
  selector: 'jd-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
  @Input() sorce="";
  @Output() public closed = new EventEmitter<void>();
  counter=2
  constructor(private service: TemplatesService) { }

  ngOnInit(): void {
  }
  public handleOnClick(stateCounter: number) {
    this.counter++;
  }
  close()
  {
    this.closed.emit();
  }
  async savedEvent(event:any)
  {
    console.log('test Saved Event')
    console.log(event)
    await this.service.onDownload(event);
  }
}
