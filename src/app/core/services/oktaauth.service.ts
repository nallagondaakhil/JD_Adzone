import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "src/app/modules/admin/models/paged-data.model";
import { CookieUtil } from "src/app/shared/utils/cookie.util";
import { environment } from "src/environments/environment";

import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
import { OktaAuth, IDToken, AccessToken } from '@okta/okta-auth-js';
import { UserService } from "./user.service";
import { AlertsService, AlertType } from "src/app/shared/services/alerts.service";
import { ApiErrorUtil } from "src/app/shared/utils/api-error.util";
import { ConditionalExpr } from "@angular/compiler";
import { RolePermissionService } from "src/app/modules/adzone-admin/services/role-permission.service";



@Injectable()
export class OktaService {
  baseApiUrl = environment.apiBaseUrl;
  // CLIENT_ID = '0oa10iizk4iNqDhg60h8';
  // ISSUER = 'https://sso-dev.johndeere.com/oauth2/ausgnh0431ebF8iiL0h7'
  // LOGIN_REDIRECT_URI = 'http://localhost:4200/home';
  // LOGOUT_REDIRECT_URI = 'http://localhost:4200';

  oktaAuth = new OktaAuth({
    clientId: environment.oktaDetail.CLIENT_ID,
    issuer: environment.oktaDetail.ISSUER,
    redirectUri: environment.oktaDetail.LOGIN_REDIRECT_URI,
    pkce: true
    // clientId: '',
    // issuer: '',
    // redirectUri: '',
    // pkce: true
  });

  //'0oayuxvygkBUmLN1K0h7'
  isAdmin: boolean;
  isSubRegionAdmin: boolean;
  viewAccess: any;
  roleId: any;
  $isAuthenticated: Observable<boolean>;
  public observer?: Observer<boolean>;
  isRedirect = sessionStorage.getItem('loginUrl')

  constructor(private router: Router, private http: HttpClient, private userService: UserService, private alertService: AlertsService,
    private rolepermission: RolePermissionService) {
    this.$isAuthenticated = new Observable((observer: Observer<boolean>) => {
      this.observer = observer;
      this.isAuthenticated().then(val => {
        observer.next(val);
      });
      this.isAdmin = this.userService.isAdmin();
      this.isSubRegionAdmin = this.userService.isSubRegionAdmin();
      // sessionStorage.removeItem('loginUrl');
    });
  }

  public getToken() {
    return CookieUtil.getCookie('token');
  }

  public getRacfId() {
    return CookieUtil.getCookie('racfId');
  }

  public removeRacfId() {
    return CookieUtil.eraseCookie('racfId');
  }

  public getRole() {
    return CookieUtil.getCookie('role');
  }

  public removeToken() {
    return CookieUtil.eraseCookie('token');
  }

  public removetokenExpiry() {
    return CookieUtil.eraseCookie("tokenExpiry");
  }

  public removeAccessToken() {
    this.oktaAuth.token = null;
    return this.oktaAuth.tokenManager.remove('accessToken');
  }

  public getRefreshtoken() {

    return CookieUtil.getCookie('refreshtoken');

  }

  public removeRefreshToken() {

    return CookieUtil.eraseCookie('refreshtoken');

  }

  public setToken(token: any) {

    return CookieUtil.setCookie("token", token, 1);

  }



  public setRefToken(refToken: any) {

    return CookieUtil.setCookie('refreshtoken', refToken, 1);

  }

  public async authenticate(racfId: string, accessToken: string, expiry: any) {
    alert("log")
    const url = `${this.baseApiUrl}/v1/api/okta-authenticate`;
    let headers = new HttpHeaders();
    headers = headers.append('skipToken', 'true');
    return this.http.post<ApiResponse<{ jwt: string }>>(url, { racfId, accessToken, expiry }, { headers }).toPromise();
  }

  //#region  

  async isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!(await this.oktaAuth.tokenManager.get('accessToken'));
  }

  login(originalUrl: string) {
    // Save current URL before redirect
    sessionStorage.setItem('okta-app-url', originalUrl || this.router.url);

    // Launches the login redirect.
    this.oktaAuth.token.getWithRedirect({
      scopes: ['openid', 'profile', 'offline_access']
    });
  }

  async handleAuthentication() {

    await this.oktaAuth.token.parseFromUrl().then(async tokenContainer => {
      try {
        this.oktaAuth.tokenManager.add('idToken', tokenContainer.tokens.idToken as IDToken);
        this.oktaAuth.tokenManager.add('accessToken', tokenContainer.tokens.accessToken as AccessToken);

        console.log("okta details", tokenContainer);
        const racfid = tokenContainer.tokens.accessToken.claims.userID;
        const tokenExpiry = tokenContainer.tokens.accessToken.expiresAt;
        const acesstoken = tokenContainer.tokens.accessToken.accessToken;
        const refreshToken = tokenContainer.tokens?.refreshToken?.refreshToken;
        CookieUtil.setCookie("racfId", racfid, 1);
        CookieUtil.setCookie("tokenExpiry", tokenExpiry.toString(), 1);
        CookieUtil.setCookie("token", acesstoken, 1);
        localStorage.setItem("token",acesstoken);
        CookieUtil.setCookie('refreshtoken', refreshToken, 1);
        await this.userService.setUserInfo();

        try {
          if (this.isAuthenticated()) {
            this.observer?.next(true);
          }

          // Retrieve the saved URL and navigate back
          if (this.userService?.userInfo?.racfId) {
            await this.userService.loginTime();
            this.roleId = this.userService.getUserRoleId();
            await this.rolepermission.getPermissionForModule(this.roleId, "Dashboard");
            await this.rolepermission.getPermissionForModule(this.roleId, "Dealer View");

            this.viewAccess = await this.rolepermission.getRoleViewAccess();
            console.log(this.viewAccess.roleType);
            // if((this.userService.isAdmin() || this.userService.isSubRegionAdmin()) && !(this.isRedirect == 'true')){
            //   this.redirect();
            // }
            // else if((this.userService.isJdUser() || this.userService.isVendor() || this.userService.isDealer()) && !(this.isRedirect == 'true')){
            //   this.redirectToDashboard();
            // }
            // else if((this.userService.isJdUser() || this.userService.isVendor() || this.userService.isDealer()) && (this.isRedirect == 'true')){
            //   this.redirectToDetailedView();
            // }
            if (this.viewAccess.roleType == "Dashboard View Access") {
              this.redirect();
            } else if (this.viewAccess.roleType == "Dealer View Access") {
              this.redirectToDashboard();
            }
          }
          else {
            setTimeout(() => {
              this.logout();

             }, 1000);
          }
        }
        catch (e) { }


      }

      catch (e) {
        this.userService.setUserInfo();
      }
    }).catch(error => {
      // this.alertService.show('RACF ID not valid', AlertType.Critical);
      // setTimeout(() => {
      this.logout();

      //  }, 1000);

    })



  }

  redirect() {
    localStorage.removeItem('currentheaderMenuId');
    localStorage.removeItem('currentMenuId');
    localStorage.removeItem('currentsideMenuId');
    localStorage.removeItem('menu ID');
    window.location.href = '/master/dashboard';
    this.router.navigate(['/master/dashboard']);
  }

  redirectToDashboard() {
    localStorage.removeItem('currentheaderMenuId');
    localStorage.removeItem('currentMenuId');
    localStorage.removeItem('currentsideMenuId');
    localStorage.removeItem('menu ID');
    window.location.href = '/master/end-user-management';
    this.router.navigate(['/master/end-user-management']);
  }

  redirectToDetailedView() {
    window.location.href = '/master/detailed-view/' + sessionStorage.getItem("detailedId");
    this.router.navigate(['/master/detailed-view/' + sessionStorage.getItem("detailedId")]);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('dealerView');
    localStorage.removeItem('currentMenuId');
    localStorage.removeItem('currentsideMenuId');
    localStorage.removeItem('currentheaderMenuId');
    localStorage.removeItem('menu ID');
    localStorage.removeItem('userGuide');
    localStorage.removeItem('CountryCode');
    this.removeRacfId();
    this.removeToken();
    this.oktaAuth.tokenManager.remove('accessToken');
    this.oktaAuth.signOut({

      postLogoutRedirectUri: environment.oktaDetail.LOGOUT_REDIRECT_URI,

    });
  }

  //#endregion






}
