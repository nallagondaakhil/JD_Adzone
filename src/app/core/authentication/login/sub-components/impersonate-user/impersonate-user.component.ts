import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { CookieUtil } from 'src/app/shared/utils/cookie.util';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'jd-impersonate-user',
  templateUrl: './impersonate-user.component.html',
  styleUrls: ['./impersonate-user.component.scss']
})
export class ImpersonateUserComponent implements OnInit {
  loading = false;
  racfId = '';
  
  constructor(private service: AuthService, private router: Router, private alertService: AlertsService) { }

  ngOnInit(): void {
  }

  onimpersonateuser(){
    this.loading = true;
    // this.service.getUserInfowithracfId(this.racfId.toUpperCase()).then(res => {
    //   if (ApiErrorUtil.isError(res)) {
    //     this.alertService.show(ApiErrorUtil.errorMessage(res) || 'Invalid RACF ID', AlertType.Critical);
    //   } else {
    //     //this.saveToken(res.data.jwt);
    //     this.saveRacfId(this.racfId.toUpperCase());
    //     window.location.href = '/homepage';
    //     // this.router.navigate(['/home']);
    //     //this.alertService.show('You are now logged in as'+ this.racfId);

    //   }
    //   this.loading = false;
    // }).catch((er: any) => {
    //   this.alertService.show('Invalid RACF ID', AlertType.Critical);
    //   this.loading = false;
    // });
  }

  saveToken(token: string) {
    // save to cookie
    CookieUtil.setCookie('impersonatetoken', token, 1);
  }

  saveRacfId(racfId: string) {
    // save to cookie
    CookieUtil.setCookie('impersonateracfId', racfId, 1);
  }
  closemodal()
  {
    window.location.href = '/homepage';
  }
  }

