import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Input } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { MasterDataService } from "../../admin/services/master-data.service";
import { DocumentTypeView, FileUplodResult } from "../document-type/models/doc-type-view.model";
import { DocumentTypeMasterModel } from "../models/doc-type-master.model";

@Injectable()
export class DocumentTypeService {
    apiUrl = environment.apiBaseUrl;
    uploadUrl = environment.uploadURL;
    onChangeView:Subject<any> = new Subject();
    static DOC_CACHE: Promise<MasterDataModel[]>;
    constructor(private http: HttpClient,private userService : UserService) {
    }

    getPreviewImages(options: PagedRequestOptions, body:any):Promise<any>{
        console.log(options)
        const headers = new HttpHeaders();
        body = {
            "documentId":body
        }
        return this.http.post<ApiResponse<DocumentTypeMasterModel>>(`${this.apiUrl}/v1/api/DocumentManagementService/preview`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }

    updatePreviewImages(options: PagedRequestOptions, body:any){
        const headers = new HttpHeaders();
        body = {
            "thumbnailImageRequestDto":body
        }
        return this.http.post<ApiResponse<DocumentTypeMasterModel>>(`${this.apiUrl}/v1/api/DocumentManagementService/updateOptimizedThumbnail`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }

    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        return this.http.post<PagedResponse<DocumentTypeMasterModel>>(`${this.apiUrl}/v1/api/DocumentManagementService/getDocument`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
   

    getList(body:any,documentId: any,RacfId:any): Promise<any> {
        const headers = new HttpHeaders();
        return this.http.get<PagedResponse<DocumentTypeMasterModel>>(`${this.apiUrl}/v1/api/DocumentManagementService/documentPreviewById?documentId=${documentId}&racfId=${RacfId}`,body || {}).toPromise();
    }
    
    initiateExportExcel(options: any ,  requestBody: any,racfId:any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/downloadDocumentExcel?currentUser=${racfId}`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        // return this.http.get<ApiResponse<any>>(url).toPromise();
    }

    create(data: DocumentTypeMasterModel) {
        console.log('adddocument',data)
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/addDocument`;
        return this.http.post<ApiResponse<DocumentTypeMasterModel>>(url, data).toPromise();
    }

    activate(id: number) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/activateDocument?currentUser=${this.userService.getRacfId()}&documentId=${id}`;
        return this.http.put<ApiResponse<DocumentTypeView>>(url, {'documentId':id,'currentUser':this.userService.getRacfId()}).toPromise();
    }

    deactivate(id: number) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/deactivateDocument?currentUser=${this.userService.getRacfId()}&documentId=${id}`;
        return this.http.put<ApiResponse<DocumentTypeView>>(url, {'documentId':id,'currentUser':this.userService.getRacfId()}).toPromise();
    }

    delete(id: number) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/deleteDocument?currentUser=${this.userService.getRacfId()}&documentId=${id}`;
        return this.http.delete<ApiResponse<DocumentTypeView>>(url, {}).toPromise();
    }

    update(data: DocumentTypeMasterModel) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/updateDocument`;
        return this.http.put<ApiResponse<DocumentTypeMasterModel>>(url, data).toPromise();
    }

    documentsubchildId:any;
    uploadedDocValues :any= [];
    uploadFiles(file: File,selectedFields: DocumentTypeView) {
        const formData = new FormData();
        console.log(selectedFields);
        const headers = new HttpHeaders({slug: 'upload_file'});
        formData.append('files' , file, file.name);
        // if(selectedFields?.documentSubChildCategoryId.length == null || []){
        //      this.documentsubchildId = "";  
        // }else{
        //     this.documentsubchildId = selectedFields?.documentSubChildCategoryId[0].id || null;
        // }
        if(selectedFields.documentSubChildCategoryId != undefined && selectedFields.documentSubChildCategoryId != null ){
            this.uploadedDocValues = selectedFields.documentSubChildCategoryId
            if(this.uploadedDocValues.length != 0){
                if(this.uploadedDocValues != undefined && this.uploadedDocValues != null){
                    this.documentsubchildId = this.uploadedDocValues[0]?.id
                    const url = `${this.uploadUrl}/v1/api/MultipartUploadService/uploadFile?currentUser=${this.userService.getRacfId()}&documentId=${selectedFields?.documentId}&documentSubChildCategoryId=${this.documentsubchildId}`;
                    return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
                }
            }else{
                if(this.uploadedDocValues == null || []){
                    this.documentsubchildId = ''
                    const url = `${this.uploadUrl}/v1/api/MultipartUploadService/uploadFile?currentUser=${this.userService.getRacfId()}&documentId=${selectedFields?.documentId}&documentSubChildCategoryId=${this.documentsubchildId}`;
                    return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
                }
            }
        }else{
            this.documentsubchildId = ''
            const url = `${this.uploadUrl}/v1/api/MultipartUploadService/uploadFile?currentUser=${this.userService.getRacfId()}&documentId=${selectedFields?.documentId}&documentSubChildCategoryId=${this.documentsubchildId}`;
            return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
        }
    }
    uploadthumbFiles(file: File,selectedFields: DocumentTypeView) {
        const formData = new FormData();
        const headers = new HttpHeaders({slug: 'upload_file'});
        formData.append('file' , file, file.name);
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/uploadThumbnail?currentUser=${this.userService.getRacfId()}&documentId=${selectedFields?.documentId}`;
        return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
    }
    getTemplateDownloadUrl(racfId:any) {
        return `${this.apiUrl}/v1/api/DocumentManagementService/downloadDocumentExcel?currentUser=${racfId}`;
    }
    deleteFile(id: number) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/deleteFile?fileId=${id}&currentUser=${this.userService.getRacfId()}`;
        return this.http.delete<ApiResponse<DocumentTypeView>>(url, {}).toPromise();
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
        MasterDataService.ZONE_CACHE_BY_REGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'subModuleSlug': 'create_doc'}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.regionId, name: x.regionName}));
        })).toPromise();
        return await MasterDataService.ZONE_CACHE_BY_REGION;
    }
    async getSubRegion(regionIds:any,forceQueryFromServer:boolean = false) {
        if (MasterDataService.ZONE_CACHE_BY_SUBREGION && !forceQueryFromServer) {
            return await MasterDataService.ZONE_CACHE_BY_SUBREGION;
        }
        var paramsRegionIds;
        if(regionIds.length>0){
            paramsRegionIds = {'subRegions': regionIds};
            if (regionIds?.subModuleSlug) {
                paramsRegionIds['subModuleSlug'] = regionIds?.subModuleSlug;
            }
        }else{
            paramsRegionIds ={};
        }
        const url = `${this.apiUrl}/v1/api/LocationManagementService/getSubRegionDropDown?userId=${this.userService.getUserId()}`;
        MasterDataService.ZONE_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,paramsRegionIds).pipe(map(res => {
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
            if(id?.subModuleSlug) {
                marketIds['subModuleSlug'] = id?.subModuleSlug;
            }
        }else{
        marketIds ={}
        }
        const url = `${this.apiUrl}/v1/api/LocationManagementService/getMarketDropDown?userId=${this.userService.getUserId()}`;
        MasterDataService.ZONE_CACHE_BY_COUNTRY = this.http.post<ApiResponse<MasterDataModel[]>>(url,marketIds).pipe(map(res => {
        // MasterDataService.ZONE_CACHE_BY_COUNTRY = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'markets':id}).pipe(map(res => {
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
            if(id?.subModuleSlug) {
                divisionIds['subModuleSlug'] = id?.subModuleSlug;
            }
        }else{
        divisionIds = {};
        }
        const url = `${this.apiUrl}/v1/api/LocationManagementService/getDivisionDropDown?userId=${this.userService.getUserId()}`;
        MasterDataService.DIVISION_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,divisionIds).pipe(map(res => {
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
    
    async getMenuDocCategory(forceQueryFromServer:boolean = false) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentCategoryDropDown`;
        const docCat = this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.documentCategoryId, name: x.documentCategoryName}));
        })).toPromise();
        return await docCat;
    }
    async getsubchildMenuItem(id: number,forceQueryFromServer:boolean = false)
    {
      const data= {"documentSubCategoryId":id};
      const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildCategoryDropDown`;
      const docCat = this.http.post<ApiResponse<MasterDataModel[]>>(url,data).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({documentchildId: x.documentSubChildCategoryId, documentChildName: x.documentSubChildCategoryName}));
    })).toPromise();
    return await docCat;
    }
    async getsubchildFourthMenu(id: number,forceQueryFromServer:boolean = false) {
        console.log('data',id)
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildFourthCategoryDropDown`;
        const cat1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'documentSubChildCategoryId':id}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({idChildmenu: x.documentSubChildFourthCategoryId, nameChildmenu: x.documentSubChildFourthCategoryName}));
        })).toPromise();
        return await cat1;
    }
    async getApproval() {
        const url = `${this.apiUrl}/v1/api/docApproval/allStatus`;
        const cat1 = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.id, name: x.status}));
        })).toPromise();
        return await cat1;
    }
    async getApprovalAll() {
        const url = `${this.apiUrl}/v1/api/docApproval/allStatus?showAll=true`;
        const cat1 = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.id, name: x.status}));
        })).toPromise();
        return await cat1;
    }
    async getDocCat1(id: number,forceQueryFromServer:boolean = false) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubCategoryDropDown`;
        const cat1 = this.http.post<ApiResponse<DocumentTypeMasterModel[]>>(url,{'documentCategoryId':id}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.documentSubCategoryId,
                 name: x.documentSubCategoryName}));
       
        })).toPromise();
        return await cat1;
    }

    async getMenuDocCat1(id: number,forceQueryFromServer:boolean = false) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubCategoryDropDown`;
        const cat1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'documentCategoryId':id}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            
             return res.data.map((x: any) => ({id: x.documentSubCategoryId,
                name: x.documentSubCategoryName}));
       
        })).toPromise();
        
        await this.onChangeView.next(cat1);
        return await cat1;
    }
    
    async getDocCat2(id: number,forceQueryFromServer:boolean = false) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildCategoryDropDown`;
        const cat1 = this.http.post<ApiResponse<DocumentTypeMasterModel[]>>(url,{'documentSubCategoryId':id}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.documentSubChildCategoryId, name: x.documentSubChildCategoryName}));
        })).toPromise();
        return await cat1;
    }
    async getDocCat3(id: number,forceQueryFromServer:boolean = false) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildFourthCategoryDropDown`;
        const cat1 = this.http.post<ApiResponse<DocumentTypeMasterModel[]>>(url,{'documentSubChildCategoryId':id}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.documentSubChildFourthCategoryId, name: x.documentSubChildFourthCategoryName}));
        })).toPromise();
        return await cat1;
    }
    async getCategory(id: number) {
        if (id == null) { return null; }
        let items: MasterDataModel[] = [];
        if (DocumentTypeService.DOC_CACHE) {
            items = await DocumentTypeService.DOC_CACHE;
        } else {
            items = await this.getDocCat2(id,true);
            items = await this.getDocCat3(id,true);

        }
        return items && items.find(x => x.id === id);
    }
}