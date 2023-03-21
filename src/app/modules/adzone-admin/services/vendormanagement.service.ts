import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";import { HttpUtil } from "src/app/shared/utils/http.util";
import { VendorManagement } from "../models/vendor-management.model";
import { VendorManagementView } from "../../adzone-admin/vendor-management/models/vendor-management-view.model";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { MasterDataService } from "../../admin/services/master-data.service";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { UserService } from "src/app/core/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class VendormanagementService {
  apiuserUrl = environment.apiuserBaseUrl;
  apiUrl = environment.apiBaseUrl;
  userId:any;
  static DOC_CACHE: Promise<MasterDataModel[]>;
  constructor(private http: HttpClient,private userService : UserService) { 
    this.userId = this.userService.getUserId(); 
  }

  getAllVendor(options: PagedRequestOptions, body: any): Promise<any> {
  const headers = new HttpHeaders();
  return this.http.post<PagedResponse<VendorManagement>>(`${this.apiuserUrl}/v1/api/VendorManagementService/getVendor?racfId=${this.userService.getRacfId()}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();

}
activate(id: number) {
const url = `${this.apiuserUrl}/v1/api/VendorManagementService/activateVendor`;
return this.http.post<ApiResponse<VendorManagementView>>(url, {'vendorId':id,'currentUser':this.userService.getRacfId()}).toPromise();
}

deactivate(id: number) {
const url = `${this.apiuserUrl}/v1/api/VendorManagementService/deactivateVendor`;
return this.http.post<ApiResponse<VendorManagementView>>(url, {'vendorId':id,'currentUser':this.userService.getRacfId()}).toPromise();
}

delete(id: number) {
const url = `${this.apiuserUrl}/v1/api/VendorManagementService/deleteVendor`;
return this.http.post<ApiResponse<VendorManagementView>>(url, {'vendorId':id,'currentUser':this.userService.getRacfId()}).toPromise();
}
getTemplateDownloadUrl() {
  return `${this.apiuserUrl}/v1/api/VendorManagementService/downloadVendorExcel`;
}
getvendorTemplateDownloadUrl(){
  return `${this.apiuserUrl}/v1/api/VendorManagementService/downloadVendorBulkuploadTemplateFile`;

}
async getRegion(forceQueryFromServer:boolean = false) {
  if (MasterDataService.ZONE_CACHE_BY_REGION && !forceQueryFromServer) {
      return await MasterDataService.ZONE_CACHE_BY_REGION;
  }
  const url = `${this.apiUrl}/v1/api/LocationManagementService/getRegionDropDown`;
  MasterDataService.ZONE_CACHE_BY_REGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,{}).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({id: x.regionId, name: x.regionName}));
  })).toPromise();
  return await MasterDataService.ZONE_CACHE_BY_REGION;
}
async getSubRegion(regionIds:any,forceQueryFromServer:boolean = false) {
  if (MasterDataService.ZONE_CACHE_BY_SUBREGION && !forceQueryFromServer) {
      return await MasterDataService.ZONE_CACHE_BY_SUBREGION;
  }
  var subRegionIds;
    if(regionIds.length>0){
      subRegionIds = {'subRegions': regionIds};
    }else{
      subRegionIds ={};
    }
  const url = `${this.apiUrl}/v1/api/LocationManagementService/getSubRegionDropDown`;
  MasterDataService.ZONE_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,subRegionIds).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({id: x.subRegionId, name: x.subRegionName}));
  })).toPromise();
  return await MasterDataService.ZONE_CACHE_BY_SUBREGION;
}
async getCountry(id:any,forceQueryFromServer:boolean = false) {
  if (MasterDataService.ZONE_CACHE_BY_COUNTRY && !forceQueryFromServer) {
      return await MasterDataService.ZONE_CACHE_BY_COUNTRY;
  }
  var marketIds;
  if(id.length>0){
    marketIds ={'markets': id};
  }else{
    marketIds ={}
  }
  const url = `${this.apiUrl}/v1/api/LocationManagementService/getMarketDropDown`;
  MasterDataService.ZONE_CACHE_BY_COUNTRY = this.http.post<ApiResponse<MasterDataModel[]>>(url,marketIds).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({id: x.marketId, name: x.marketName}));
  })).toPromise();
  return await MasterDataService.ZONE_CACHE_BY_COUNTRY;
}
async getDivision(id:any,forceQueryFromServer:boolean = false) {
  if (MasterDataService.DIVISION_CACHE_BY_SUBREGION && !forceQueryFromServer) {
      return await MasterDataService.DIVISION_CACHE_BY_SUBREGION;
  }
  var divisionIds;
    if(id.length>0){
      divisionIds = {'divisions': id};
    }else{
      divisionIds = {};
    }
  const url = `${this.apiUrl}/v1/api/LocationManagementService/getDivisionDropDown`;
  MasterDataService.DIVISION_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,divisionIds).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({id: x.divisionId, name: x.divisionName}));
  })).toPromise();
  return await MasterDataService.DIVISION_CACHE_BY_SUBREGION;
}
create(data: VendorManagement) {
  const url = `${this.apiuserUrl}/v1/api/VendorManagementService/addVendor`;
  return this.http.post<ApiResponse<VendorManagement>>(url, data).toPromise();
}
update(data: VendorManagement) {
  const url = `${this.apiuserUrl}/v1/api/VendorManagementService/updateVendor`;
  return this.http.post<ApiResponse<VendorManagement>>(url, data).toPromise();
}
bulkUpload(file: File) {
  const headers = new HttpHeaders({slug: 'vendor_bulk_upload'});
  const formData = new FormData();
  formData.append('file', file, file.name);
  const url = `${this.apiuserUrl}/v1/api/VendorManagementService/bulk_upload?racfID=${this.userService.getRacfId()}`;
  //return
   //DownloadUtil.downloadFile(this.http, url, 'vendorbulkupload.xlsx' , 'vendor-management');
  return this.http.post(url, formData, {reportProgress: true, observe: 'response', responseType: 'blob' as 'json', headers});
}

}
