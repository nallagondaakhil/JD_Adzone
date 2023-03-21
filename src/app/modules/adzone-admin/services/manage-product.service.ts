import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { UserService } from 'src/app/core/services/user.service';
import { HttpUtil } from 'src/app/shared/utils/http.util';
import { environment } from 'src/environments/environment';
import { MasterDataModel } from '../../admin/models/master-data.model';
import { ApiResponse, PagedRequestOptions, PagedResponse } from '../../admin/models/paged-data.model';
import { MasterDataService } from '../../admin/services/master-data.service';
import { FileUplodResult } from '../document-type/models/doc-type-view.model';
import { ManageProductView } from '../manage-product/models/manage-product-view.model';
import { ManageProductMasterModel } from '../models/manage-product-master.model';

@Injectable({
  providedIn: 'root'
})
export class ManageProductService {
  apiUrl = environment.apiBaseUrl;
  static DOC_CACHE: Promise<MasterDataModel[]>;
  constructor(private http: HttpClient,private userService : UserService) { }

  getAll(options: PagedRequestOptions, body: any): Promise<any> {
      console.log(options);
    const headers = new HttpHeaders();
    return this.http.post<PagedResponse<ManageProductMasterModel>>(`${this.apiUrl}/v1/api/ProductManagementService/getProduct`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
  }
  initiateExportExcel(options: any ,  requestBody: any,racfId:any): Promise<ApiResponse<any>> {
    const headers = new HttpHeaders({slug: 'download_excel'});
    const url = `${this.apiUrl}/v1/api/ProductManagementService/downloadProductExcel?currentUser=${racfId}`;
    return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
    // return this.http.get<ApiResponse<any>>(url).toPromise();
}
  getsearch(body: any): Promise<any> {
  const headers = new HttpHeaders();
  let queryParams = new HttpParams();
  if(body.productSearch != null && body.productSearch.length > 0)
  {
  queryParams = queryParams.append("search",body.productSearch);
  }
  return this.http.post<PagedResponse<ManageProductMasterModel>>(`${this.apiUrl}/v1/api/ProductManagementService/getProduct`, body || {}, { params:queryParams, headers }).toPromise();

 // return this.http.post<PagedResponse<ManageProductMasterModel>>(`${this.apiUrl}/v1/api/ProductManagementService/getProduct`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
}

  uploadthumbFiles(file: File,selectedFields: ManageProductView) {
    const formData = new FormData();
    const headers = new HttpHeaders({slug: 'upload_file'});
    formData.append('file' , file, file.name);
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/uploadThumbnail?currentUser=${this.userService.getRacfId()}&documentId=${selectedFields?.documentId}`;
    return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
}
uploadFiles(file: File,selectedFields: ManageProductView) {
    const formData = new FormData();
    console.log(selectedFields);
    const headers = new HttpHeaders({slug: 'upload_file'});
    formData.append('files' , file, file.name);
    var documentsubchildId;
    if(selectedFields?.documentSubChildCategoryId == null){
         documentsubchildId = "";  
    }else{
        documentsubchildId = selectedFields?.documentSubChildCategoryId[0].id || null;

    }
    console.log(documentsubchildId);
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/uploadFile?currentUser=${this.userService.getRacfId()}&documentId=${selectedFields?.documentId}&documentSubChildCategoryId=${documentsubchildId}`;
    return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
}
getTemplateDownloadUrl(racfId:any) {
    return `${this.apiUrl}/v1/api/ProductManagementService/downloadProductExcel?currentUser=${racfId}`;
}
deleteFile(id: number) {
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/deleteFile?fileId=${id}&currentUser=${this.userService.getRacfId()}`;
    return this.http.delete<ApiResponse<ManageProductView>>(url, {}).toPromise();
}
downloadFile(fileName: string) {
    // const url = `${this.apiUrl}/v1/api/DocumentManagementService/downloadFiles?fileName=${fileName}`;
    // return this.http.post<ApiResponse<DocumentTypeView>>(url, {}).toPromise();
    return `${this.apiUrl}/v1/api/DocumentManagementService/downloadFile?fileName=${fileName}`;
}
async getRegion(forceQueryFromServer:boolean = false) {
    if (MasterDataService.ZONE_CACHE_BY_REGION && !forceQueryFromServer) {
        return await MasterDataService.ZONE_CACHE_BY_REGION;
    }
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getRegionDropDown?userId=${this.userService.getUserId()}`;
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
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getSubRegionDropDown?userId=${this.userService.getUserId()}`;
    MasterDataService.ZONE_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'subRegions':regionIds}).pipe(map(res => {
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
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getMarketDropDown?userId=${this.userService.getUserId()}`;
    MasterDataService.ZONE_CACHE_BY_COUNTRY = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'markets':id}).pipe(map(res => {
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
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getDivisionDropDown?userId=${this.userService.getUserId()}`;
    MasterDataService.DIVISION_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'divisions':id}).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.divisionId, name: x.divisionName}));
    })).toPromise();
    return await MasterDataService.DIVISION_CACHE_BY_SUBREGION;
}
async getDocCategory(forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentCategoryDropDown`;
    const docCat = this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.documentCategoryId, name: x.documentCategoryName}));
    })).toPromise();
    return await docCat;
}


async getDocCat1(id: number,forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubCategoryDropDown`;
    const cat1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'documentCategoryId':id}).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.documentSubCategoryId,
             name: x.documentSubCategoryName}));
   
    })).toPromise();
    return await cat1;
}


async getDocCat2(id: number,forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildCategoryDropDown`;
    const cat1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'documentSubCategoryId':id}).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.documentSubChildCategoryId, name: x.documentSubChildCategoryName}));
    })).toPromise();
    return await cat1;
}
async getCategory(id: number) {
    if (id == null) { return null; }
    let items: MasterDataModel[] = [];
    if (ManageProductService.DOC_CACHE) {
        items = await ManageProductService.DOC_CACHE;
    } else {
        items = await this.getDocCat2(id,true);
    }
    return items && items.find(x => x.id === id);
}
create(data: ManageProductMasterModel) {
    const url = `${this.apiUrl}/v1/api/ProductManagementService/addProduct`;
    return this.http.post<ApiResponse<ManageProductMasterModel>>(url, data).toPromise();
}
update(data: ManageProductMasterModel) {
    const url = `${this.apiUrl}/v1/api/ProductManagementService/updateProduct`;
    return this.http.put<ApiResponse<ManageProductMasterModel>>(url, data).toPromise();
}
delete(id: number) {


    const url = `${this.apiUrl}/v1/api/ProductManagementService/deleteProduct?documentId=${id}&currentUser=${this.userService.getRacfId()}`;
    return this.http.delete<ApiResponse<ManageProductView>>(url, {}).toPromise();
}
async editDocument(id: any): Promise<any> {
    const url = `${this.apiUrl}/v1/api/ProductManagementService/getProductById?documentId=${id}`;
    //return this.http.delete<ApiResponse<ManageProductView>>(url, {}).toPromise();
    return this.http.get<PagedResponse<ManageProductView>>(url).toPromise();
}
  
}
