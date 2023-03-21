import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { mainModules, roleModel } from "../models/role-master.model";
import { roleViewModel } from "../role-management/models/role-view.model";

@Injectable()
export class RoleService {
    apiUrl = environment.apiBaseUrl;
    apiNewUrl = environment.apiuserBaseUrl
    constructor(private http: HttpClient,private userService : UserService) {
    }
    async getRole(forceQueryFromServer: boolean = false) {
        const url = `${this.apiNewUrl}/v1/api/RoleManagementService/activeRoles`;
        const res = this.http.get<ApiResponse<roleModel[]>>(url).toPromise().then(res => {
          if (!res || !res.data) { return []; }
          return res.data.map((x: any) => ({ id: x.roleId, name: x.roleName }));
        });
        return await res;
    }
    async getAllModules(): Promise<ApiResponse<mainModules[]>> {
        const url = `${this.apiNewUrl}/v1/api/ModuleManagementService/modules`;
        let res =  this.http.get<ApiResponse<mainModules[]>>(url).toPromise().then(res => {
          if (res.error?.erroCode) { return null; }
          return res;
         });
        return await res;
    }
    async getModulesByRoles(roleId:number): Promise<ApiResponse<mainModules[]>> {
        const url = `${this.apiNewUrl}/v1/api/roleacces/roleId/${roleId}`;
        let res =  this.http.get<ApiResponse<mainModules[]>>(url).toPromise().then(res => {
          if (res.error?.erroCode) { return null; }
          return res;
         });
        return await res;
    }
    permissionCheck(){
        const url = `${this.apiNewUrl}/v1/api/roleacces/accessDetails/add_banner/${this.userService.getRacfId()}`;
        let res =  this.http.get<ApiResponse<mainModules[]>>(url).toPromise().then(res => {
            if (res.error?.erroCode) { return null; }
            return res;
           });
          return res;
    }
    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        console.log("body",body)
        return this.http.post<PagedResponse<roleModel>>(`${this.apiNewUrl}/v1/api/RoleManagementService/roles`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
        // return this.http.get<ApiResponse<any>>(`${this.apiNewUrl}/v1/api/RoleManagementService/activeRoles`).toPromise();
    }

    initiateExportExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiNewUrl}/v1/api/RoleManagementService/roles/export/excel`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }

    create(data: mainModules) {
        const url = `${this.apiNewUrl}/v1/api/RoleManagementService/role`;
        return this.http.post<ApiResponse<mainModules>>(url, data).toPromise();
    }

    activate(id: number) {
        const url = `${this.apiNewUrl}/v1/api/RoleManagementService/activateRole?roleId=${id}&currentUser=${this.userService.getRacfId()}`;
        return this.http.put<ApiResponse<roleModel>>(url, {}).toPromise();
    }

    deactivate(id: number) {
        const url = `${this.apiNewUrl}/v1/api/RoleManagementService/deactivateRole?roleId=${id}&currentUser=${this.userService.getRacfId()}`;
        return this.http.put<ApiResponse<roleModel>>(url, {}).toPromise();
    }

    delete(id: number) {
        const url = `${this.apiNewUrl}/v1/api/RoleManagementService/roles?roleId=${id}&currentUser=${this.userService.getRacfId()}`;
        return this.http.delete<ApiResponse<roleModel>>(url, {}).toPromise();
    }

    update(data: mainModules) {
        const url = `${this.apiNewUrl}/v1/api/RoleManagementService/updateRoles`;
        return this.http.put<ApiResponse<mainModules>>(url, data).toPromise();
    }
    getTemplateDownloadUrl() {
        return `${this.apiNewUrl}/v1/api/RoleManagementService/roles/export/excel`;
    }
}