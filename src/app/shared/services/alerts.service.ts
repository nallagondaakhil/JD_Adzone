import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AlertsService {
  publisher: Subject<Alerts> = new Subject<Alerts>();
  show(message: string, type: AlertType = AlertType.Success, description?: string) {
    this.publisher.next({title: message, alertType: type, description});
  }

  showWithOptions(option: Alerts) {
    this.publisher.next(option);
  }
}

export interface Alerts {
  title?: string;
  description?: string;
  alertType?: AlertType;
  downloadText?: string;
  downloadLink?: string;
  downloadFileName?: string;
  ExecelSerchBody?: any;
  ExecelFilterBody?:any;
}

export enum AlertType {
  Success,
  Warning,
  Critical,
  Info,
}
