import { Component, OnInit } from '@angular/core';
import { Alerts, AlertsService } from 'src/app/shared/services/alerts.service';

@Component({
  selector: 'jd-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {
  activeAlerts: Alerts[] = [];

  constructor(private service: AlertsService) { }

  ngOnInit(): void {
    this.service.publisher.subscribe(alert => {
      this.activeAlerts = [];
      this.activeAlerts.push(alert);
    });
  }

  onDismiss(alert: Alerts) {
    const indx = this.activeAlerts.indexOf(alert);
    this.activeAlerts.splice(indx, 1);
  }

}
