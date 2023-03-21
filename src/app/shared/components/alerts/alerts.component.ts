import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Alerts, AlertsService, AlertType } from '../../services/alerts.service';
import { DownloadUtil } from '../../utils/download-util';

@Component({
  selector: 'jd-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit {
  @Input() alertModel: Alerts;
  @Output() dismiss: EventEmitter<Alerts> = new EventEmitter<Alerts>();

  alertType: typeof AlertType;

  constructor(private http: HttpClient,public translate:TranslateService) {
    this.alertType = AlertType;
  }

  ngOnInit(): void {
    this.autoDismiss();
  }

  // ngOnChanges(change: SimpleChanges) {
  //   change.params ? this.autoDismiss() : null;
  // }

  autoDismiss() {
    setTimeout(() => {
      this.onDismiss();
    }, 5000);
  }

  onDismiss() {
    this.dismiss.next(this.alertModel);
  }

  onDownloadClick() {
    if (this.alertModel.downloadLink) {
      //ToDo slug 
      DownloadUtil.downloadFile(this.http, this.alertModel.downloadLink, this.alertModel.downloadFileName ,'',this.alertModel.ExecelSerchBody,this.alertModel.ExecelFilterBody);
    }
  }
}
