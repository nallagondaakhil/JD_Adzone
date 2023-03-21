import { Component, OnInit } from '@angular/core';
import { OktaService } from 'src/app/core/services/oktaauth.service'; 
import { UserService } from 'src/app/core/services/user.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CookieUtil } from 'src/app/shared/utils/cookie.util';


@Component({
  selector: 'jd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  racfId = '';
  constructor(private okta: OktaService , private userService: UserService,private alertService: AlertsService) {
    // this.okta.handleAuthentication();     
   }

  ngOnInit(): void {
    this.racfId = this.userService.getRacfId();
    if(CookieUtil.getCookie('impersonatetoken'))
    this.alertService.show('you are logged in as ' + this.racfId);
  }

}
