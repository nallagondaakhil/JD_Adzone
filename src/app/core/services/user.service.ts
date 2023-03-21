import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ApiResponse } from "src/app/modules/admin/models/paged-data.model";
import { AlertsService, AlertType } from "src/app/shared/services/alerts.service";
import { ApiErrorUtil } from "src/app/shared/utils/api-error.util";
import { Constants } from "src/app/shared/utils/constants";
import { CookieUtil } from "src/app/shared/utils/cookie.util";
import { environment } from "src/environments/environment";
//import { OktaService } from "./oktaauth.service";

@Injectable()
export class UserService {
  baseApiUrl = environment.apiBaseUrl;
  baseNewApiUrl = environment.apiuserBaseUrl;
  userInfo: {name: string, role: string, racfId: string,roleId: string,userId: number,languageCode:string,iso2CountryCode:string};
  userRoleId: {roleId: string};
  userInfoChange = new Subject<{name: string, role: string, racfId: string, roleId: string,languageCode:string}>();

  constructor(private http: HttpClient,
    private router: Router,
   private alertService: AlertsService,
  // private okta: OktaService
   ) {}

  public getRacfId() {
    // if(CookieUtil.getCookie('impersonateracfId'))
    // return CookieUtil.getCookie('impersonateracfId');
    return CookieUtil.getCookie('racfId');
  }

  public getToken() {
    // if(CookieUtil.getCookie('impersonatetoken'))
    // return CookieUtil.getCookie('impersonatetoken');
    return CookieUtil.getCookie('token');
  }

  public async setUserInfo() {
    if (!this.getToken() || !this.getRacfId()) { return; }
    try {
      const url = `${this.baseNewApiUrl}/v1/api/UserManagementService/userInfo/${this.getRacfId()}`;
      const res = await this.http.get<ApiResponse<{name: string, role: string, userId: number, roleId: string,languageCode:string,iso2CountryCode:string}>>(url).toPromise();
      if (ApiErrorUtil.isError(res)) {
        this.alertService.show(ApiErrorUtil.errorMessage(res) || 'Login failed', AlertType.Critical);
     return;
          } else {
        this.userInfo = {name: res.data.name, role: res.data.role, racfId: this.getRacfId(),roleId:res.data?.roleId, userId: res.data?.userId,languageCode:res.data?.languageCode,iso2CountryCode:res.data?.iso2CountryCode};
        console.log('userInfor',this.userInfo)
        localStorage.setItem('USERACCESSINFO',res.data.role)
        if(this.userInfo.languageCode != null){
          localStorage.setItem('userLangCode',res.data?.languageCode)
        }
        localStorage.setItem('CountryCode',res.data?.iso2CountryCode)
      }
    } catch (error) {
    }
  }

  footerManuals(value:any){
    const url = `${this.baseNewApiUrl}/v1/api/UserManagementService/getTermsPrivacyLink/${value}`;
    return this.http.get<ApiResponse<any>>(url, {}).toPromise();
  }
  public async loginTime()
  {
    if (!this.getToken() || !this.getRacfId()) { return; }
    try {
      let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      var RacfId ={"racfId": this.getRacfId(),"timeZone":timeZone}
      const url = `${this.baseNewApiUrl}/v1/api/UserManagementService/dealerLogIn`;
      return this.http.post<ApiResponse<any>>(url, RacfId || {}).toPromise();
     
    } catch (error) {
    }
  }
  
  getUserRoleId(){
    return this.userInfo?.roleId;
  }

  getUserId(){
    return this.userInfo?.userId;
  }

  getRoleName(){
    return this.userInfo?.role;
  }

  isAdmin() {
    if(this.userInfo?.role.toLowerCase() === Constants.roles.admin.toLowerCase()){
    return true;
    }else{
    return this.userInfo?.role.toLowerCase() === Constants.roles.superAdmin.toLowerCase();
    }
  }

  //administrator
  isVendor() {
    return this.userInfo?.role.toLowerCase() === Constants.roles.vendor.toLowerCase();
  }
  isDealer() {
    return this.userInfo?.role.toLowerCase() === Constants.roles.dealers.toLowerCase();
  }
  isSubRegionAdmin() {
    return this.userInfo?.role.toLowerCase() === Constants.roles.subRegionAdmin.toLowerCase();
  }
  isJdUser() {
    return this.userInfo?.role.toLowerCase() === Constants.roles.johnDeersEmployees.toLowerCase();
  }
  isProductSpecialist() {
    // return true;
    if (!this.userInfo) { return false; }
    return this.userInfo.role.toLowerCase() === Constants.roles.productSpecialist.toLowerCase() ||
      this.userInfo.role.toLowerCase() === Constants.roles.tcm.toLowerCase() ||
      this.userInfo.role.toLowerCase() === Constants.roles.tm.toLowerCase();
  }

  isImsUser() {
    if (!this.userInfo) { return false; }
    return this.userInfo.role.toLowerCase() === Constants.roles.ims.toLowerCase() ||
    this.userInfo.role.toLowerCase() === Constants.roles.ims2.toLowerCase();
  }

  isAreaManager() {
    if (!this.userInfo) { return false; }
    return this.userInfo.role.toLowerCase() === Constants.roles.areaManager.toLowerCase();
  }

  isSegmentManager() {
    if (!this.userInfo) { return false; }
    return this.userInfo.role.toLowerCase() === Constants.roles.segmentManager.toLowerCase();
  }

  isVpSales() {
    if (!this.userInfo) { return false; }
    return this.userInfo.role.toLowerCase() === Constants.roles.vpSales.toLowerCase();
  }

  isClaimReviewer() {
    if (!this.userInfo) { return false; }
    return this.userInfo.role.toLowerCase() === Constants.roles.claimReviewer.toLowerCase();
  }

  isFinanceReviewer() {
    if (!this.userInfo) { return false; }
    return this.userInfo.role.toLowerCase() === Constants.roles.financeReviewer.toLowerCase();
  }

}
