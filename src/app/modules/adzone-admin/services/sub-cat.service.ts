import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { UserService } from 'src/app/core/services/user.service';
import { HttpUtil } from 'src/app/shared/utils/http.util';
import { environment } from 'src/environments/environment';
import { MasterDataModel } from '../../admin/models/master-data.model';
import { ApiResponse, PagedRequestOptions, PagedResponse } from '../../admin/models/paged-data.model';
import { SubCatView } from '../document-sub-category/models/sub-cat-view.model';
import { SubCatMaster } from '../models/sub-cat-master.model';

@Injectable({
  providedIn: 'root'
})
export class SubCatService {
  static CATEGORY_CACHE: Promise<{id: string, name: string}[]>;
  static DOC_CACHE: Promise<MasterDataModel[]>;
  apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient, private userService : UserService) { }

  getAll(options: PagedRequestOptions, body: any): Promise<any> {
    const headers = new HttpHeaders();
    return this.http.post<PagedResponse<SubCatMaster>>(`${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubCategory`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();

}

activate(id: string) {
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/activateDocumentSubCategory?currentUser=${this.userService.getRacfId()}&documentSubCategoryId=${id}`;
  return this.http.put<ApiResponse<SubCatView>>(url, {}).toPromise();
}

deactivate(id: string) {
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/deactivateDocumentSubCategory?currentUser=${this.userService.getRacfId()}&documentSubCategoryId=${id}`;
  return this.http.put<ApiResponse<SubCatView>>(url, {}).toPromise();
}
initiateExportExcel(options: any ,  requestBody: any,racfId:any): Promise<ApiResponse<any>> {
  // const headers = new HttpHeaders({slug: 'download_excel'});
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/exportDocumentCategoryExcel?currentUser=${racfId}`;
  // return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
  return this.http.get<ApiResponse<any>>(url).toPromise();
}

delete(id: string) {
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/deleteDocumentSubCategory?currentUser=${this.userService.getRacfId()}&documentSubCategoryId=${id}`;
  return this.http.delete<ApiResponse<SubCatView>>(url, {}).toPromise();
}
deleteSubCatID(id: string) {
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/deleteDocumentSubChildCategory`;
  return this.http.post<ApiResponse<SubCatView>>(url, {'documentSubChildCategoryId':id}).toPromise();
}
deleteSubFourthCatID(id: string) {
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/deleteDocumentSubChildFourthCategory`;
  return this.http.post<ApiResponse<SubCatView>>(url, {'documentSubChildFourthCategoryId':id}).toPromise();
}
create(data: SubCatMaster) {
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/addDocumentSubCategory`;
  return this.http.post<ApiResponse<SubCatMaster>>(url, data).toPromise();
}

update(data: SubCatMaster) {
  const url = `${this.apiUrl}/v1/api/DocumentManagementService/updateDocumentSubCategory`;
  return this.http.post<ApiResponse<SubCatMaster>>(url, data).toPromise();
}
getTemplateDownloadUrl(racfId:any) {
  return `${this.apiUrl}/v1/api/DocumentManagementService/downloadDocumentSubCategoryExcel?currentUser=${racfId}`;
}
async getCategoryDetails(forceQueryFromServer = false) {
//   const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentCategoryDropDown`;
//   SubCatService.DOC_CACHE
//   const categoryVal = this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map(res => {
//     if (!res || !res.data) { return []; }
//     return res.data.map((x: any) => ({id: x.documentCategoryId, name: x.documentCategoryName}));
// })).toPromise();
//   return categoryVal;

  // if (SubCatService.DOC_CACHE && !forceQueryFromServer) {
  //           return await SubCatService.DOC_CACHE;
  //       }
        const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentCategoryDropDown`;
        var result= this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map(res => {
          if (!res || !res.data) { return []; }
             return res.data.map((x: any) => ({id: x.documentCategoryId, name: x.documentCategoryName}));
        })).toPromise();
        return result;
}

async getCategory(id: number) {
  if (id == null) { return null; }
  let items: MasterDataModel[] = [];
  if (SubCatService.DOC_CACHE) {
      items = await SubCatService.DOC_CACHE;
  } else {
      items = await this.getCategoryDetails(false);
  }
  return items && items.find(x => x.id === id);
}

getLanguages(): {id:number,name:string}[]{
  return [{
      id: 1,
      name: "English",
    }];
}
}

