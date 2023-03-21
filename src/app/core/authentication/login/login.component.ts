import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { CookieUtil } from 'src/app/shared/utils/cookie.util';
import { AuthService } from '../../services/auth.service';
import { OktaService } from '../../services/oktaauth.service';

@Component({
  selector: 'jd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  racfId = '';
  isAuthenticated: boolean;

  constructor(private service: AuthService, private router: Router, private alertService: AlertsService,
  private oktaService: OktaService) { 
    this.oktaService.$isAuthenticated.subscribe(val => this.isAuthenticated = val);
    
    if(this.racfId)
    this.oktaService.login('/homepage');
  }

  ngOnInit(): void {
     this.onLogin();
    //  this.onLogin1(); //remove
  }


  onLogin() {
    this.oktaService.login('/homepage');
  }

  OnlogOut() {
    this.oktaService.logout()
  }


  onLogin1() {
    // call authenticate, get token
    // this.loading = true; // UC
    window.location.href = '/homepage'; //remove
    // this.service.authenticate(this.racfId).then(res => { //UC
    //   if (ApiErrorUtil.isError(res)) {
    //     this.alertService.show(ApiErrorUtil.errorMessage(res) || 'Login failed', AlertType.Critical);
    //   } else {
    //     this.saveToken(res.data.jwt);
    //     this.saveRacfId(this.racfId);
    //     window.location.href = '/homepage';
    //     // this.router.navigate(['/home']);
    //   }
    //   this.loading = false;
    // }).catch((er: any) => {
    //   this.alertService.show('Login failed', AlertType.Critical);
    //   this.loading = false;
    // });
  }

  saveToken(token: string) {
    // save to cookie
    CookieUtil.setCookie('token', token, 1);
  }

  saveRacfId(racfId: string) {
    // save to cookie
    CookieUtil.setCookie('racfId', racfId, 1);
  }

}
