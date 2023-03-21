import { Component, HostBinding, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/modules/poc/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  msgBody = 'Welcome to JD CMS!';
  msgTitle = 'JD CMS';
  navUrl = 'http://localhost:8080/poc/notification';

  @HostBinding('class') class = 'w-100';

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  sendNotification(): void {
    const msg = {
      data: { url: this.navUrl || 'http://localhost:8080/poc/notification' },
      body: this.msgBody,
      title: this.msgTitle || 'JD CMS',
      vibrate: [100, 50, 100],
      actions: [{
        action: 'explore',
        title: 'Go to the site'
      }]
    };
    this.notificationService.sendNotification(msg);
  }

}
