import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ApiResponse } from "src/app/modules/admin/models/paged-data.model";
import { AlertsService, AlertType } from "src/app/shared/services/alerts.service";
import { ApiErrorUtil } from "src/app/shared/utils/api-error.util";
import { CookieUtil } from "src/app/shared/utils/cookie.util";
import { environment } from "src/environments/environment";
import { OktaService } from "./oktaauth.service";
import { catchError, tap } from "rxjs/operators";
@Injectable()
export class AuthService {
  baseApiUrl = environment.apiBaseUrl;
  baseNewApiUrl = environment.apiuserBaseUrl;
  constructor(private http: HttpClient,public router: Router,private alertService: AlertsService,private okta:OktaService) {
    var initialUrl = window.location.href
    if(initialUrl.split("/")[4] == "detailed-view"){
      sessionStorage.setItem("loginUrl","true")
      sessionStorage.setItem("detailedId",initialUrl.split("/")[5]+"/"+initialUrl.split("/")[6])
      // sessionStorage.setItem("detailedFileId",initialUrl.split("/")[6])
    }
    
  }

  public getToken() {
    // if(CookieUtil.getCookie('impersonatetoken'))
    // return CookieUtil.getCookie('impersonatetoken');
    return CookieUtil.getCookie('token');
  }

  public getRacfId() {
    if(CookieUtil.getCookie('impersonateracfId'))
    return CookieUtil.getCookie('impersonateracfId');
    return CookieUtil.getCookie('racfId');
  }

  // public getRole() {
  //   return CookieUtil.getCookie('role');
  // }

  public removeToken() {
    if(CookieUtil.getCookie('impersonatetoken'))
    CookieUtil.eraseCookie('impersonatetoken'); 
    return CookieUtil.eraseCookie('token');
  }

  dealerLogout(racfId:any,loginId:any)
  {
    var RacfId = {"racfId":racfId};
    console.log(RacfId);
    const url = `${this.baseNewApiUrl}/v1/api/UserManagementService/dealerLogOut`;
    return this.http.post<ApiResponse<any>>(url, RacfId || {}).toPromise();

  }

  public removeImpersonateToken() {
    if(CookieUtil.getCookie('impersonateracfId'))
    CookieUtil.eraseCookie('impersonateracfId')
    return CookieUtil.eraseCookie('impersonatetoken'); 
  }
  
  public isAuthenticated(): boolean {
    const token = CookieUtil.getCookie('token');
    // Check whether the token is expired and return
    // true or false
    // return true;
    if(!token){
      CookieUtil.eraseCookie('token')
      CookieUtil.eraseCookie('refreshtoken')
      }
  
      // return token !== 'null' ? true : false;
      return !!token;
  }

  public async authenticate(racfId: string) {
    const url = `${this.baseApiUrl}/api/v1/authenticate`;
    let headers = new HttpHeaders();
    headers = headers.append('skipToken', 'true');
    return this.http.post<ApiResponse<{jwt: string}>>(url, {racfId}, {headers}).toPromise();
  }

  public async getUserInfo() {
    const url = `${this.baseApiUrl}/api/v1/user/userInfo/${this.getRacfId()}`;
    return this.http.get<ApiResponse<{name: string, role: string}>>(url).toPromise();
  }

  public async getUserInfowithracfId(racfId:string) {
    const url = `${this.baseApiUrl}/api/v1/user/userInfo/${racfId}`;
    return this.http.get<ApiResponse<{name: string, role: string}>>(url).toPromise();
  }

  refreshToken(refreshData: any): Observable<any> {
    // console.log(refreshData)
    if(refreshData.refresh_token !=null){
     this.okta.removeAccessToken();
     this.okta.removeRefreshToken();
     let headers= new HttpHeaders();
     headers = headers.append('skipToken', 'true');
     headers = headers.append('Accept', 'application/json');
     headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('Content-Type','application/x-www-form-urlencoded');
     headers = headers.append('cache-control','no-cache');
    const body = new HttpParams()
     .set('grant_type','refresh_token')
    .set('redirect_uri',environment.oktaDetail.LOGOUT_REDIRECT_URI)
     .set('scope', 'openid profile offline_access')
     .set('refresh_token', refreshData.refresh_token)
    .set('client_id',environment.oktaDetail.CLIENT_ID);
     return this.http.post<any>(environment.oktaDetail.ISSUER+'/v1/token', body,{headers} ) 
    
     .pipe(
     tap((res:any)=> {
     console.log("okta details", res,res.access_token);
     this.okta.setToken(res.access_token);
     this.okta.setRefToken(res.refresh_token);
     },
     err =>{
     console.log(err);
     this.alertService.show('Session is expired please login', AlertType.Warning);
     this.okta.logout();
    
     })
    // catchError(AuthService.handleErrors)
     )
    }else{
      this.router.navigate(['login']);
    }
    } 
    

}
