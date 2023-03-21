import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { BannerViewModel } from "../banner-master/models/banner-view.model";
import { FileUplodResult } from "../document-type/models/doc-type-view.model";
import { BannerMasterModel } from "../models/banner-master.model";

@Injectable()
export class BannerService {
    apiUrl = environment.apiBaseUrl;
    apiNewUrl = environment.apiuserBaseUrl;
    categoryId: number;
    imageNo: number;
    bannerId:number;
    racfId:any;
    constructor(private http: HttpClient,private userService : UserService) {
        
    }
    uploadFile1(file: File, params:any) {
        const formData = new FormData();
        formData.append('file' , file, file.name);
        const headers = new HttpHeaders({slug: 'upload_file'});
        const url = `${this.apiUrl}/v1/api/BannerService/uploadBanner?categoryId=${this.categoryId}&imageNo=${params}`;
        return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
    }
    // uploadFile2(file: File) {
    //     const formData = new FormData();
    //     formData.append('file' , file, file.name);
    //     const headers = new HttpHeaders({slug: 'upload_file'});
    //     const url = `${this.apiUrl}/v1/api/BannerService/uploadBanner?categoryId=1&imageNo=2`;
    //     return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
    // }
    // uploadFile3(file: File) {
    //     const formData = new FormData();
    //     formData.append('file' , file, file.name);
    //     const headers = new HttpHeaders({slug: 'upload_file'});
    //     const url = `${this.apiUrl}/v1/api/BannerService/uploadBanner?categoryId=1&imageNo=3`;
    //     return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
    // }
    // uploadFile4(file: File) {
    //     const formData = new FormData();
    //     formData.append('file' , file, file.name);
    //     const headers = new HttpHeaders({slug: 'upload_file'});
    //     const url = `${this.apiUrl}/v1/api/BannerService/uploadBanner?categoryId=1&imageNo=4`;
    //     return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
    // }
    // uploadFile5(file: File) {
    //     const formData = new FormData();
    //     formData.append('file' , file, file.name);
    //     const headers = new HttpHeaders({slug: 'upload_file'});
    //     const url = `${this.apiUrl}/v1/api/BannerService/uploadBanner?categoryId=1&imageNo=5`;
    //     return this.http.post<ApiResponse<FileUplodResult>>(url, formData, {reportProgress: true, observe: 'events', headers});
    // }
    getAll(body: any,RacfId:any): Promise<any> {
        // console.log(body,RacfId)
        const headers = new HttpHeaders();
        return this.http.get<PagedResponse<BannerMasterModel>>(`${this.apiUrl}/v1/api/BannerService/banner?categoryId=${body.id}&racfId=${RacfId}`, body || {},).toPromise();
    }
    getBannerImages(options: PagedRequestOptions, body:any):Promise<any>{
        const headers = new HttpHeaders();
        body = {
            "categoryId":body
        }
        return this.http.post<ApiResponse<BannerMasterModel>>(`${this.apiUrl}/v1/api/BannerService/preview`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    activate(bannerId: number,imageNo:number) {
        const url = `${this.apiUrl}/v1/api/BannerService/active?bannerId=${bannerId}&imageNo=${imageNo}`;
        return this.http.post<ApiResponse<BannerMasterModel>>(url, {}).toPromise();
    }

    deactivate(bannerId: number,imageNo:number) {
        const url = `${this.apiUrl}/v1/api/BannerService/deactive?bannerId=${bannerId}&imageNo=${imageNo}`;
        return this.http.post<ApiResponse<BannerMasterModel>>(url, {}).toPromise();
    }
    deleteFile(id: number) {
        const url = `${this.apiUrl}/v1/api/BannerService/banner?bannerId=${id}`;
        return this.http.delete<ApiResponse<BannerViewModel>>(url, {}).toPromise();
    }
}