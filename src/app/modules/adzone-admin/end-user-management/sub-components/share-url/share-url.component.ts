import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { EndUserModelMapper, EndUserView } from '../../models/end-user-view.model';

@Component({
  selector: 'jd-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.scss']
})
export class ShareUrlComponent implements OnInit {
  @Output() closed = new EventEmitter();
  @Input() model: EndUserView;
  constructor(private alertService: AlertsService,public translate:TranslateService) { }

  ngOnInit(): void {
    this.model = this.model || {} as any;
  }
  onClose(){
    this.closed.emit();
    
  }
  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.translate.get('HOME').subscribe((data:any)=> {
      this.alertService.show(data.COPIEDTOCLIPBOARD);
     });
    // this.alertService.show("Copied to clipboard");
  }
}
