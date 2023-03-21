import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { DashboardMaster } from "../models/dashboard-master.model"; 
@Injectable({
  providedIn: 'root'
})
export class DashoardServiceService {
  apiuserUrl = environment.apiuserBaseUrl;
  constructor(private http: HttpClient,private userService:UserService) { }

  getAllOrderSummaryData(body:any): Promise<ApiResponse<any>>{
    const url = `${this.apiuserUrl}/v1/api/DashboardManagement/DashboardOrderSummaryData?userId=${this.userService.getUserId()}`; 
    return this.http.post<ApiResponse<DashboardMaster>>(url,body).toPromise();
}
// getAllDocumentSummaryData(body:any): Promise<ApiResponse<any>>{
    
//   const url = `${this.apiuserUrl}/v1/api/DashboardManagement/DashboardDocumentCategoryBasedDownloadSummaryData`; 
//   return this.http.post<ApiResponse<DashboardMaster>>(url,{}).toPromise();
// }
  
  getTileData(body:any): Promise<ApiResponse<any>>{
    console.log('body',body)
    const url = `${this.apiuserUrl}/v1/api/DashboardManagement/DashboardTilesData?userId=${this.userService.getUserId()}`; 
    return this.http.post<ApiResponse<DashboardMaster>>(url,body).toPromise();
  }
  getAllDocumentSummaryData(body:any): Promise<ApiResponse<any>>{
      
    const url = `${this.apiuserUrl}/v1/api/DashboardManagement/DashboardDocumentCategoryBasedDownloadSummaryData?userId=${this.userService.getUserId()}`; 
    return this.http.post<ApiResponse<DashboardMaster>>(url,body).toPromise();
  }
  async getDocumentDownloadUploadReport(body: any) {
    const url = `${this.apiuserUrl}/v1/api/DashboardManagement/UploadDownloadCountsByType?userId=${this.userService.getUserId()}`;
    const docCat = this.http.post<ApiResponse<DashboardMaster[]>>(url,body).pipe(map(res => {
        console.log('rescount',res)
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({ fileType:x.fileType,download:x.downloaded,upload:x.uploaded }));
    })).toPromise();

    return await docCat;
}
  getMonthDownload(body:any): Promise<ApiResponse<any>>{
    
    const url = `${this.apiuserUrl}/v1/api/DashboardManagement/DashboardDocumentMonthWiseDownloadData?userId=${this.userService.getUserId()}`; 
    return this.http.post<ApiResponse<DashboardMaster>>(url,body || {}).toPromise();
  }

  getMonthUpload(body:any): Promise<ApiResponse<any>>{
    console.log(body);
    const url = `${this.apiuserUrl}/v1/api/DashboardManagement/DashboardDocumentMonthWiseUploadData?userId=${this.userService.getUserId()}`; 
    return this.http.post<ApiResponse<DashboardMaster>>(url,body || {}).toPromise();
  }

async getTrndDealer(body,forceQueryFromServer: boolean = false) {
  const url = `${this.apiuserUrl}/v1/api/DashboardManagement/TopTrendingDealers?userId=${this.userService.getUserId()}`;
  const docCat = this.http.post<ApiResponse<DashboardMaster[]>>(url,body).pipe(map(res => {
     
      if (!res || !res.data) { return []; }
      return res.data.map((x: any, index: number) => ({ id: x.dealerCode, name: x.dealerName ,count:x.documentsDownload}));
  })).toPromise();

  return await docCat;
}
async getTrndDocuments(body,forceQueryFromServer: boolean = false) {
  const url = `${this.apiuserUrl}/v1/api/DashboardManagement/TopTrendingDocuments?userId=${this.userService.getUserId()}`;
  const docCat = this.http.post<ApiResponse<DashboardMaster[]>>(url,body).pipe(map(res => {
     
      if (!res || !res.data) { return []; }
      return res.data.map((x: any, index: number) => ({ id: index, name: x.documentFileName ,count:x.documentCount}));
  })).toPromise();

  return await docCat;
}

}

