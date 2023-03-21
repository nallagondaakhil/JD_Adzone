import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { DealerManagementMasterModel } from "../models/dealer-management-master.model";

@Injectable()
export class DealerManagementService {
    apiUrl = environment.apiuserBaseUrl;
    constructor(private http: HttpClient,private userService : UserService) {
    }

    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        return this.http.post<PagedResponse<DealerManagementMasterModel>>(`${this.apiUrl}/v1/api/dealerController/getDealers`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    initiateExportExcel(options: any ,  requestBody: any,RacfId: any): Promise<ApiResponse<any>> {
        // const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiUrl}/v1/api/dealerController/downloadDealersExcel?currentUser=${RacfId}`;
        // return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        return this.http.get<ApiResponse<any>>(url).toPromise();
    }
    getTemplateDownloadUrl(RacfId: any) {
        return `${this.apiUrl}/v1/api/dealerController/downloadDealersExcel?currentUser=${RacfId}`;
    }
}