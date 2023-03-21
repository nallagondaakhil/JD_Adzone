import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";


@Injectable({
  providedIn: 'root'
})
export class TemplateGalleryService {
  apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient,  private userService : UserService) { }
  getAllImage(options: PagedRequestOptions, body: any,): Promise<PagedResponse<{
    documentCategoryId:number,
    documentCategoryName: string,
    documentFileName:  string,
    documentId: number,
    documentSubCategoryId: number,
    documentSubCategoryName:string,
    documentSubChildCategoryName: null
    extension: string,
    imgSrc:string,
    base64ImagePath:string
  }>> {
    const headers = new HttpHeaders();
  //   body ={

  //     "categoryList":[

  //         {"id":48,"categoryName":"Test"}

  //     ],

  //     "subCategoryList":[]

  // }
  body ={...body,widthHeightFlag:false}
    return this.http.post<PagedResponse<{
      documentCategoryId:number,
      documentCategoryName: string,
      documentFileName:  string,
      documentId: number,
      documentSubCategoryId: number,
      documentSubCategoryName:string,
      documentSubChildCategoryName: null
      extension: string,
      imgSrc:string,
      base64ImagePath:string
    }>>(`${this.apiUrl}/v1/api/GalleryService/gallery/${this.userService.getRacfId()}`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
  }
  getTemplatesBase64(urls){
    const url = `${this.apiUrl}${urls}`;
    return this.http.get<ApiResponse<any>>(url, {observe: 'response', responseType: 'string' as 'json'}).toPromise();
  }
}
