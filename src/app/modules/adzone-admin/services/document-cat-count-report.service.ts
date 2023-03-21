import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { CategoryCountReportMasterModel } from "../models/document-cat-count-report-master.model";

@Injectable()
export class CategoryCountService {
    apiUrl = environment.apiBaseUrl;
    apiuserUrl = environment.apiuserBaseUrl;
    userId:any;
    constructor(private http: HttpClient,private userService : UserService) {
        this.userId = this.userService.getUserId(); 
    }
    getAllDealer(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        return this.http.post<PagedResponse<CategoryCountReportMasterModel>>(`${this.apiuserUrl}/v1/api/ReportsService/dealers`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        var racfId = this.userService.getRacfId();
        return this.http.post<PagedResponse<CategoryCountReportMasterModel>>(`${this.apiUrl}/v1/api/DocumentReportService/documents?racfId=${racfId}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    getAllDownload(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        var racfId = this.userService.getRacfId();
        return this.http.post<PagedResponse<CategoryCountReportMasterModel>>(`${this.apiUrl}/v1/api/DocumentReportService/downloads?racfId=${racfId}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    getAllUser(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        var racfId = this.userService.getRacfId();
        let queryParams = new HttpParams();
        if(!options.sortBy){
            options.sortBy ="logInTime";
        }
        console.log("madhu",options);
        return this.http.post<PagedResponse<CategoryCountReportMasterModel>>(`${this.apiuserUrl}/v1/api/UserActivityReportService/getUserActivityReport?racfId=${racfId}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    getAllDealerLog(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        var racfId;
       //console.log(body.dealerId,body.dealerName);
       if(body.dealerId){
        racfId ={"racfId":this.userService.getRacfId()};
         var payLoadData =Object.assign(body,racfId);
       }else{
        racfId ={"racfId":this.userService.getRacfId(),"dealerId":"","dealerName":""};
         var payLoadData =Object.assign(body,racfId);
       }
        
        return this.http.post<PagedResponse<CategoryCountReportMasterModel>>(`${this.apiuserUrl}/v1/api/UserManagementService/getDealerLogInInfo`, payLoadData || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    getAllUploaded(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        var racfId = this.userService.getRacfId();
        //var roleName ={"roleName":this.userService.getRoleName()};
         // var payLoadData =Object.assign(body,racfId);
        return this.http.post<PagedResponse<CategoryCountReportMasterModel>>(`${this.apiUrl}/v1/api/DocumentReportService/upload?racfId=${racfId}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    initiateExportDocumentCountExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiUrl}/v1/api/DocumentReportService/documentsExport`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }
    initiateDealerOrderExportExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiuserUrl}/v1/api/ReportsService/dealersexport`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }
    
    initiateExportDocumentDownloadExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiUrl}/v1/api/DocumentReportService/downloadsexport`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }
    initiateExportDocumentUploadExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiUrl}/v1/api/DocumentReportService/uploadexport`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }

    initiateExportUserActivityExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiuserUrl}/v1/api/UserActivityReportService/userActivityReportExportToExcel`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }

    initiateDealerLoggedExportExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiuserUrl}/v1/api/UserManagementService/getDealerLogInInfoExportToExcel`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }
    
    
    getDownloadTemplateDownloadUrl() {
        var racfId = this.userService.getRacfId();
        return `${this.apiUrl}/v1/api/DocumentReportService/downloadsexport?racfId=${racfId}`;
    }
    getTemplateDealerLoggedDownloadUrl(){
        var racfId = this.userService.getRacfId();
        return `${this.apiuserUrl}/v1/api/UserManagementService/getDealerLogInInfoExportToExcel`;
  
    }
    getUserActivityTemplateDownloadUrl() {
        var racfId = this.userService.getRacfId();
        return `${this.apiuserUrl}/v1/api/UserActivityReportService/userActivityReportExportToExcel?racfId=${racfId}`;
    }
    getUploadTemplateDownloadUrl() {
        var racfId = this.userService.getRacfId();
        return `${this.apiUrl}/v1/api/DocumentReportService/uploadexport?racfId=${racfId}`;
    }
    getTemplateDownloadUrl() {
        var racfId = this.userService.getRacfId();
        return `${this.apiUrl}/v1/api/DocumentReportService/documentsExport?racfId=${racfId}`;
    }
    getDealerOrderTemplateDownloadUrl() {
        return `${this.apiuserUrl}/v1/api/ReportsService/dealersexport`;
    }
    async getMarket(forceQueryFromServer:boolean = false) {
        
        const url = `${this.apiUrl}/v1/api/LocationManagementService/getMarketDropDown?userId=${this.userId}`;
        var marketdata = this.http.post<ApiResponse<CategoryCountReportMasterModel[]>>(url,{}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.marketId, name: x.marketName}));
        })).toPromise();
        return await marketdata;
      }
      async getDealer(forceQueryFromServer:boolean = false){
        const url = `${this.apiuserUrl}/v1/api/UserManagementService/getDealer`;
        var payBody={"dealerId":"","dealerName":""}
        var dealerdata = this.http.post<ApiResponse<CategoryCountReportMasterModel[]>>(url,payBody).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.dealerId, name: x.dealerName}));
        })).toPromise();
        console.log(await dealerdata)
        return await dealerdata;
      }
}