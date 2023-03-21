
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators"; import { HttpUtil } from "src/app/shared/utils/http.util";
import { UserManagement } from "../models/user-management.model";
import { UserManagementView } from "../../adzone-admin/user-management/models/user-management-view.model";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { MasterDataService } from "../../admin/services/master-data.service";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { UserService } from "src/app/core/services/user.service";

@Injectable()
export class UsermanagementService {
  apiuserUrl = environment.apiuserBaseUrl;
  apiUrl = environment.apiBaseUrl;
  userId:any;
  static DOC_CACHE: Promise<MasterDataModel[]>;
  constructor(private http: HttpClient,private userService : UserService) {
    this.userId = this.userService.getUserId();
   
    
  }

  getAllUser(options: PagedRequestOptions, body: any): Promise<any> {
    const headers = new HttpHeaders();
    return this.http.post<PagedResponse<UserManagement>>(`${this.apiuserUrl}/v1/api/UserManagementService/getUser?racfId=${this.userService.getRacfId()}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();

  }
  setUserAccessControl(payLoad) {
    const url = `${this.apiuserUrl}/v1/api/documentAccessController/setDocumentAcess/${this.userService.getRacfId()}`;
    return this.http.post(url, { ...payLoad }).toPromise();
  }
  getAllUserRacfId(options: PagedRequestOptions, body: any): Promise<any> {
    const headers = new HttpHeaders();
    return this.http.post<PagedResponse<UserManagement>>(`${this.apiuserUrl}/v1/api/UserManagementService/getAllUserRacfId?racfId=${this.userService.getRacfId()}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
  }
  getDocumentAccess(params) {
    const url = `${this.apiuserUrl}/v1/api/documentAccessController/getDocumentAcess/${params}`;
    return this.http.get(url, {}).toPromise();
  }
  activate(id: string) {
    const url = `${this.apiuserUrl}/v1/api/UserManagementService/activateUser`;
    return this.http.post<ApiResponse<UserManagementView>>(url, { 'userId': id,'currentUser':this.userService.getRacfId() }).toPromise();
  }

  deactivate(id: string) {
    const url = `${this.apiuserUrl}/v1/api/UserManagementService/deactivateUser`;
    return this.http.post<ApiResponse<UserManagementView>>(url, { 'userId': id,'currentUser':this.userService.getRacfId() }).toPromise();
  }

  delete(id: string) {
    const url = `${this.apiuserUrl}/v1/api/UserManagementService/deleteUser`;
    return this.http.post<ApiResponse<UserManagementView>>(url, { 'userId': id,'currentUser':this.userService.getRacfId() }).toPromise();
  }
  getTemplateDownloadUrl() {
    return `${this.apiuserUrl}/v1/api/UserManagementService/downloadUserExcel`;
  }
  getbulkTemplateDownloadUrl(){
    return `${this.apiuserUrl}/v1/api/UserManagementService/downloadUserBulkuploadTemplateFile`;

  }
  async getRegion(forceQueryFromServer: boolean = false) {
    if (MasterDataService.ZONE_CACHE_BY_REGION && !forceQueryFromServer) {
      return await MasterDataService.ZONE_CACHE_BY_REGION;
    }
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getRegionDropDown?userId=${this.userService.getUserId()}`;
    MasterDataService.ZONE_CACHE_BY_REGION = this.http.post<ApiResponse<MasterDataModel[]>>(url, {}).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({ id: x.regionId, name: x.regionName }));
    })).toPromise();
    return await MasterDataService.ZONE_CACHE_BY_REGION;
  }
  async getSubRegion(regionIds: any, forceQueryFromServer: boolean = false) {
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
      return res.data.map((x: any) => ({ id: x.subRegionId, name: x.subRegionName }));
    })).toPromise();
    return await MasterDataService.ZONE_CACHE_BY_SUBREGION;
  }
  async getCountry(id: any, forceQueryFromServer: boolean = false) {
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
      return res.data.map((x: any) => ({ id: x.marketId, name: x.marketName }));
    })).toPromise();
    return await MasterDataService.ZONE_CACHE_BY_COUNTRY;
  }
  async getDivision(id: any, forceQueryFromServer: boolean = false) {
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
      return res.data.map((x: any) => ({ id: x.divisionId, name: x.divisionName }));
    })).toPromise();
    return await MasterDataService.DIVISION_CACHE_BY_SUBREGION;
  }
  async getDealer(id: any, forceQueryFromServer: boolean = false) {
    if (MasterDataService.DEALER_CACHE_BY_SUBREGION && !forceQueryFromServer) {
      return await MasterDataService.DEALER_CACHE_BY_SUBREGION;
    }
    const url = `${this.apiuserUrl}/v1/api/dealerController/getActiveDealersDropDown`;
    MasterDataService.DEALER_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url, { 'markets': id }).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({ id: x.dealerCode, name: x.dealerName }));
    })).toPromise();
    return await MasterDataService.DEALER_CACHE_BY_SUBREGION;
  }
  
  create(data: UserManagement) {
    const url = `${this.apiuserUrl}/v1/api/UserManagementService/addUser`;
    return this.http.post<ApiResponse<UserManagement>>(url, data).toPromise();
  }
  update(data: UserManagement) {
    const url = `${this.apiuserUrl}/v1/api/UserManagementService/updateUser`;
    return this.http.post<ApiResponse<UserManagement>>(url, data).toPromise();
  }
  bulkUpload(file: File) {
    const headers = new HttpHeaders({slug: 'user_bulk_upload'});
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiuserUrl}/v1/api/UserManagementService/bulk_upload?racfId=${this.userService.getRacfId()}`;
    //return this.http.post(url, formData, {reportProgress: true, observe: 'events', headers});
    return this.http.post(url, formData, {reportProgress: true, observe: 'response', responseType: 'blob' as 'json', headers});
  }


}
