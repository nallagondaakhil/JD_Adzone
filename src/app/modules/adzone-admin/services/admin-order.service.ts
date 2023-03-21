import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { userInfo } from "os";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { ApiResponse, PagedData, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { OrderAdminMasterModel } from "../models/admin-order.model";

@Injectable()
export class OrderAdminService {
    apiUrl = environment.apiorderBaseUrl;
    userid:any
    constructor(private http: HttpClient,private userService : UserService) {
    this.userid = userService.getUserId;
    }

    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        console.log(body);
        const headers = new HttpHeaders();
         var productFlag = {"productFlag":0};
         
         var newData = Object.assign(body,productFlag);
        return this.http.post<PagedResponse<OrderAdminMasterModel>>(`${this.apiUrl}/v1/api/OrderManagementService/getAllOrders`, newData || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    initiateExportExcel(options: any ,  requestBody: any): Promise<ApiResponse<any>> {
        // const headers = new HttpHeaders({slug: 'download_excel'});
        const url = `${this.apiUrl}v1/api/OrderManagementService/generateOrderExcel`;
        // return this.http.post<ApiResponse<any>>(url,requestBody||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
        return this.http.get<ApiResponse<any>>(url).toPromise();
    }
    updateStatus(id:number[],isSelectall:number,unselectcountry:[],countryid:string,options: any ,  requestBody: any)
    {
        let body = {
            id : id,
            orderStatus :countryid,
            isSelectAll : isSelectall,
            unSelectIds :unselectcountry, 
            ...requestBody,
        }
        console.log(body)
        const headers = new HttpHeaders();
        const url = `${this.apiUrl}/v1/api/OrderManagementService/updatedAllOrderStatus`;
        return this.http.post<ApiResponse<any>>(url, body||{}, {params: HttpUtil.convertReqOptionToParams(options),headers}).toPromise();
    }
    async getStatus(){
        const url = `${this.apiUrl}/v1/api/OrderManagementService/getAllDropDownForStatus`;
        const getstatus = this.http.post<ApiResponse<MasterDataModel[]>>(url,{}).pipe(map(res => {
            if (!res || !res.data) { return []; }
            // return res.data?.map((x: any) => ({id: x.orderDropDownId, name: x.orderDropDownName}));
            return res.data.map((x: any) => ({id: x.orderDropDownId, name: x.orderStatusValue}));
        })).toPromise();
        return await getstatus;
    }

    async getOrderPlaced(){
        const orders = [{id:0,name:"Downloaded"},{id: 1,name: 'Ordered'},]
        return await orders;
    }

    getTemplateDownloadUrl() {
        return `${this.apiUrl}/v1/api/OrderManagementService/generateOrderExcel`;
    }

}
