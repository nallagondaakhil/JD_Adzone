import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { promise } from "protractor";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { ApiResponse, PagedData, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { NotificationMastermodel } from "../models/admin-notification.model";

@Injectable()
export class AdminNotificationService {
    apiUrl = environment.apiuserBaseUrl;
    public miniNotificationCount=0;
    constructor(private http: HttpClient,private userService : UserService) {
    }

    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        body = {"racfId":this.userService.getRacfId(),"roleId":this.userService.getUserRoleId()}
        return this.http.post<PagedResponse<NotificationMastermodel>>(`${this.apiUrl}/v1/api/notificationController/getAllNotification`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }

    updateasRead(options: any, body: any): Promise<ApiResponse<any>> 
    {
        const headers = new HttpHeaders();
        const url = `${this.apiUrl}/v1/api/notificationController/updateAsRead?racfId=${this.userService.getRacfId()}`;
        return this.http.put<PagedResponse<any>>(url,{},{headers}).toPromise();
    }
    getCount(options: PagedRequestOptions, body: any): Observable<ApiResponse<any>> 
    {
        const headers = new HttpHeaders();
        const url = `${this.apiUrl}/v1/api/notificationController/getUnreadCount?racfId=${this.userService.getRacfId()}`;
        
        return this.http.post<PagedResponse<any>>(url,body || {},{ params: HttpUtil.convertReqOptionToParams(options), headers });
    }

    updateNotification(){
        const headers = new HttpHeaders({slug: 'Notification_read'});
        const url = `${this.apiUrl}`;
        return this.http.put<ApiResponse<any>>(url,null,{headers}).toPromise();
      }
    

}
