import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AnyRecord } from "dns";
import { UserService } from "src/app/core/services/user.service";
import { environment } from "src/environments/environment";
import { ApiResponse } from "../../admin/models/paged-data.model";
import { TemplatesMasterModel } from "../models/templates-master.model";

@Injectable({
    providedIn: 'root'
  })
  export class TemplatesService {
    apiUrl = environment.apiuserBaseUrl;
    constructor(
        private http: HttpClient,
        private userService : UserService
        ) { }
    onDownload(data:any) {

        var body = {"racfId":this.userService.getRacfId(),"templateName":data.fullName,"templateImageUrl":data.imageBase64,"extension":data.extension}
        console.log(body)
        const url = `${this.apiUrl}/v1/api/UserManagementService/TemplateDownloaded`;
        return this.http.post<ApiResponse<TemplatesMasterModel>>(url, body).toPromise();
    }
    getTemplates(){
        const url = `${this.apiUrl}/v1/api/UserManagementService/getTemplates?racfId=${this.userService.getRacfId()}`;
        return this.http.post<ApiResponse<TemplatesMasterModel>>(url, {}).toPromise();
    }
  }
