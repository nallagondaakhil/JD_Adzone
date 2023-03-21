import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { DocumentCategoryView } from "../document-category/models/doc-cat-view.model";
import { DocumentCategoryMasterModel } from "../models/doc-cat-master.model";

@Injectable()
export class DocumentCategoryService {
    apiUrl = environment.apiBaseUrl;
    constructor(private http: HttpClient,private userService : UserService) {
    }

    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        const headers = new HttpHeaders();
        return this.http.post<PagedResponse<DocumentCategoryMasterModel>>(`${this.apiUrl}/v1/api/DocumentManagementService/getDocumentCategory`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    getTemplateDownloadUrl(racfId:any) {
        return `${this.apiUrl}/v1/api/DocumentManagementService/downloadDocumentCategoryExcel?currentUser=${racfId}`;
    }
    initiateExportExcel(options: any ,  requestBody: any,racfId:any): Promise<ApiResponse<any>> {
        const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/exportDocumentCategoryExcel?currentUser=${racfId}`;
        return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        //return this.http.get<ApiResponse<any>>(url).toPromise();
    }

    create(data: DocumentCategoryMasterModel) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/addDocumentCategory`;
        return this.http.post<ApiResponse<DocumentCategoryMasterModel>>(url, data).toPromise();
    }

    activate(id: string) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/activateDocumentCategory?currentUser=${this.userService.getRacfId()}&documentCategoryId=${id}`;
        return this.http.put<ApiResponse<DocumentCategoryView>>(url, {}).toPromise();
    }

    deactivate(id: string) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/deactivateDocumentCategory?currentUser=${this.userService.getRacfId()}&documentCategoryId=${id}`;
        return this.http.put<ApiResponse<DocumentCategoryView>>(url, {}).toPromise();
    }

    delete(id: string) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/deleteDocumentCategory?currentUser=${this.userService.getRacfId()}&documentCategoryId=${id}`;
        return this.http.delete<ApiResponse<DocumentCategoryView>>(url, {}).toPromise();
    }

    update(data: DocumentCategoryMasterModel) {
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/updateDocumentCategory`;
        return this.http.put<ApiResponse<DocumentCategoryMasterModel>>(url, data).toPromise();
    }


}