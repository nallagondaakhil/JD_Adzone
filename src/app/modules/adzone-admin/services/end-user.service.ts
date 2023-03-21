import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { MasterDataModel } from "../../admin/models/master-data.model";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { AddressMasterModel } from "../models/address-master.model";
import { EndUserMasterModel } from "../models/end-user-master.model";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";

@Injectable()
export class EndUserService {
    apiUrl = environment.apiBaseUrl;
    apiOrderUrl = environment.apiorderBaseUrl;
    apiUserUrl = environment.apiuserBaseUrl;
    CountChangeDetected=false;
    cartCount;
    wishlistCount;
    showFilter;
    showMenu;
    showOrder;
    showAllFilter:boolean=true;
    menuFilter:boolean=false;

    downloadFilter:boolean=false;

    userRole:boolean = true;

    constructor(private http: HttpClient,
        private userService : UserService) {
    }

    getAll(options: PagedRequestOptions, body: any): Promise<any> {
        // if (body.documentSortId) {
        //     options.page = 0;
        // }
        console.log(body, 'options')

        const headers = new HttpHeaders();
        //return this.http.post<PagedResponse<EndUserMasterModel>>(`${this.apiUrl}/v1/api/DocumentGridService/documents`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
        let queryParams = new HttpParams();
        let queryParams1:any
        if (body.documentSearch != null && body.documentSearch.length > 0) {
            queryParams = queryParams.append("search", body.documentSearch);
            body.documentCategoryId = '';
        }
        if (body.documentSortId != null && body.documentSortId == 3) {
            queryParams1 = {
                page:options?.page,
                size:options?.size,
                sort:'asc',
                sortBy:'documentFileName',
                searchKey:body.documentSearch
            }
            // queryParams = queryParams.append("page", options?.page);
            // queryParams = queryParams.append("size", options?.size);
            // queryParams = queryParams.append("sort", "asc");
            // queryParams = queryParams.append("sortBy", "documentFileName");
        }
        else if (body.documentSortId != null && body.documentSortId == 4) {
            queryParams1 = {
                page:options?.page,
                size:options?.size,
                sort:'desc',
                sortBy:'documentFileName',
                searchKey:body.documentSearch
            }
            // queryParams = queryParams.append("page", options?.page);
            // queryParams = queryParams.append("size", options?.size);
            // queryParams = queryParams.append("sort", "desc");
            // queryParams = queryParams.append("sortBy", "documentFileName");
        }
        else if (body.documentSortId != null && body.documentSortId == 2) {
            queryParams1 = {
                page:options?.page,
                size:options?.size,
                sort:'asc',
                sortBy:'createdDate',
                searchKey:body.documentSearch
            }
            // queryParams = queryParams.append("page", options?.page);
            // queryParams = queryParams.append("size", options?.size);
            // queryParams = queryParams.append("sort", "asc");
            // queryParams = queryParams.append("sortBy", "createdDate");
        }
        else if (body.documentSortId != null && body.documentSortId == 1) {
            queryParams1 = {
                page:options?.page,
                size:options?.size,
                sort:'desc',
                sortBy:'createdDate',
                searchKey:body.documentSearch
            }
            // queryParams = queryParams.append("page", options?.page);
            // queryParams = queryParams.append("size", options?.size);
            // queryParams = queryParams.append("sort", "desc");
            // queryParams = queryParams.append("sortBy", "createdDate");
        }
        // console.log("params" ,options,queryParams1)
        if (body.documentSortId != undefined) {
            return this.http.post<PagedResponse<EndUserMasterModel>>(`${this.apiUrl}/v1/api/DocumentGridService/documents`, body || {}, { params: HttpUtil.convertReqOptionToParams(queryParams1), headers }).toPromise();
        } else {
            return this.http.post<PagedResponse<EndUserMasterModel>>(`${this.apiUrl}/v1/api/DocumentGridService/documents`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
        }
    }
    getUserManual(){
        const RacfId = this.userService.getRacfId();
        const url = `${this.apiUserUrl}/v1/api/UserManualService/getUserManual?currentUser=${RacfId}`;
        return this.http.get<PagedResponse<EndUserMasterModel>>(url, {}).toPromise();
    }
    getUserManualById(value:any){
        const url = `${this.apiUserUrl}/v1/api/UserManualService/getUserManualById?userManualId=${value}`;
        return this.http.get<ApiResponse<EndUserMasterModel>>(url, {}).toPromise();
    }
    getAllBanner(body: any,RacfId:any): Promise<any> {
        // console.log(body, RacfId)
        let id = localStorage.getItem('menu ID')
        body.documentCategoryId = id;
        const headers = new HttpHeaders();
        return this.http.get<PagedResponse<EndUserMasterModel>>(`${this.apiUrl}/v1/api/BannerService/banner?categoryId=${body.documentCategoryId}&racfId=${RacfId}`, body || {},).toPromise();
    }
    getAllPrintableCart(RacfId: any){
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/MyCart/${RacfId}`;
        return this.http.get<ApiResponse<EndUserMasterModel>>(url, {}).toPromise();
    }
    getAllDocumentCart(body:any,options: PagedRequestOptions){
        const RacfId = this.userService.getRacfId();
        const headers = new HttpHeaders();
        // const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/MyCart/Document/${RacfId}`;
        // return this.http.get<ApiResponse<EndUserMasterModel>>(url, {}).toPromise();
        return this.http.get<PagedResponse<EndUserMasterModel>>(`${this.apiOrderUrl}/v1/api/OrderManagementService/MyCart/Document/${RacfId}`, body || { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    async getAllMyOrder(body:any,options: PagedRequestOptions){
        // console.log(body);
        const headers = new HttpHeaders();
        //const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/getMyOrders`;
         //return this.http.post<ApiResponse<EndUserMasterModel>>(url, body || {}).toPromise();
         return this.http.post<PagedResponse<EndUserMasterModel>>(`${this.apiOrderUrl}/v1/api/OrderManagementService/getMyOrders`, body || {}, { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();


    }
    getDetailsWithId(id: number,fileId:number,racifId:any) {
        const url = `${this.apiUrl}/v1/api/DocumentGridService/documents?document_id=${id}&document_file_id=${fileId}&racfId=${racifId}`;
        return this.http.get<ApiResponse<EndUserMasterModel>>(url, {}).toPromise();
    }
    getPdfBase64(id: number,fileId:number)
    {

      const url = `${this.apiUrl}/v1/api/DocumentGridService/documents/pdf?document_id=${id}&document_file_id=${fileId}`;
        return this.http.get<ApiResponse<EndUserMasterModel>>(url, {}).toPromise();
    }
    getFeedback(id:number,RacfId:string){
        const url = `${this.apiUrl}/v1/api/FeedbackManagementService/getFeedbackById?documentFileId=${id}&currentUser=${RacfId}`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url,{}).toPromise();
    }
    createFeedback(data: EndUserMasterModel) {
        const url = `${this.apiUrl}/v1/api/FeedbackManagementService/saveFeedback`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    updateFeedback(data: EndUserMasterModel) {
        const url = `${this.apiUrl}/v1/api/FeedbackManagementService/updateFeedback`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    addWishlist(DocumentId:any,RacfId:any,documentFileId:number,productFlag:number){
        const url = `${this.apiUrl}/v1/api/WishListService/add?documentId=${DocumentId}&racfId=${RacfId}&documentFileId=${documentFileId}&productFlag=${productFlag}`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url,null).toPromise();
    }
    removeWishlist(id:any,RacfId:any){
        const url = `${this.apiUrl}/v1/api/WishListService/removewishlist?wishlistIdList=${id}`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url,null).toPromise();
    }
    getAllWishList(RacfId: any, body:any,options: PagedRequestOptions){
        // console.log("one");
        const headers = new HttpHeaders();
        const url = `${this.apiUrl}/v1/api/WishListService/user?racfId=${RacfId}`;
        return this.http.get<ApiResponse<EndUserMasterModel>>(url, body || { params: HttpUtil.convertReqOptionToParams(options), headers }).toPromise();
    }
    addtoCart(DocumentId:any,RacfId:any,documentFileId:any,productFlag:any)
    {
        const data = {'documentId':DocumentId,'createdBy':RacfId,'documentFileId':documentFileId,'productFlag':productFlag}
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/addToCart`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    removeFromCart(data:any)
    {
        //const data = {'documentId':DocumentId,'createdBy':RacfId,'userCartId':userCartId}
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/removeMyCart`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    MultipleremoveFromCart(data:any)
    {
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/removeMyCart`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    moveToCartfromWish(data:any, params?:any)
    {
        const url = `${this.apiUrl}/v1/api/WishListService/movetocart?${params}`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    moveTowishlistfromcart(data:any, params?:any){
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/movetowishlist?${params}`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    moveToOnewishlistfromcart(data:any,userCartId:any,params?:any){
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/selectItem/${userCartId}/${params}`;
        return this.http.put<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    moveToAllwishlistfromcart(data:any){
        const RacfId = this.userService.getRacfId();
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/selectAllItem/${RacfId}/${data}`;
        return this.http.put<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    moveToOnecarttfromwishlist(wishlistId:any,params?:any){
        const url = `${this.apiUrl}/v1/api/WishListService/selectItem/${wishlistId}/${params}`;
        return this.http.put<ApiResponse<EndUserMasterModel>>(url, null).toPromise();
    }
    moveToAllcarttfromwishlist(data:any){
        const RacfId = this.userService.getRacfId();
        const url = `${this.apiUrl}/v1/api/WishListService/selectAllItem/${RacfId}/${data}`;
        return this.http.put<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    getWishCartCount(RacfId:string){
        const url = `${this.apiUrl}/v1/api/WishListService/wishlistAndCartCount?racfId=${RacfId}`;
        return this.http.get<ApiResponse<EndUserMasterModel>>(url,{}).toPromise();
    }
    removefromWish(data:any)
    {
        const url = `${this.apiUrl}/v1/api/WishListService/removewishlist?${data}`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, {}).toPromise();
    }
    placeOrder(documentarray:any)
    {
        const data = documentarray;
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/placeOrders/product`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    placeDownloadOrder(documentarray:any)
    {
        const data = documentarray;
        const url = `${this.apiOrderUrl}/v1/api/OrderManagementService/placeOrders/Document`;
        return this.http.post<ApiResponse<EndUserMasterModel>>(url, data).toPromise();
    }
    downloadFile(fileName: any) {
        // const url = `${this.apiUrl}/v1/api/DocumentManagementService/downloadFiles?fileName=${fileName}`;
        // return this.http.post<ApiResponse<DocumentTypeView>>(url, {}).toPromise();
        const result = `${this.apiUrl}/v1/api/DocumentManagementService/downloadFile?fileName=${fileName}`;
        return result;
    }
    getAddress(RacfId:string){
        const url = `${this.apiUserUrl}/v1/api/OrderAddressManagement/getAddress/${RacfId}`;
        return this.http.get<ApiResponse<AddressMasterModel>>(url,{}).toPromise();
    }
    createAddress(data: AddressMasterModel) {
        const url = `${this.apiUserUrl}/v1/api/OrderAddressManagement/addAddress`;
        return this.http.post<ApiResponse<AddressMasterModel>>(url, data).toPromise();
    }
    updateAddress(data: AddressMasterModel) {
        const url = `${this.apiUserUrl}/v1/api/OrderAddressManagement/updateAddress`;
        return this.http.post<ApiResponse<AddressMasterModel>>(url, data).toPromise();
    }
    deleteAddress(data:any) {

        const url = `${this.apiUserUrl}/v1/api/OrderAddressManagement/removeAddress`;
        return this.http.post<ApiResponse<AddressMasterModel>>(url, data).toPromise();
    }
    async getUserCountries(userId: number){
        const url = `${this.apiUserUrl}/v1/api/OrderAddressManagement/getAllDropDown/${userId}`;
        const userCountry = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res =>{
            if (!res || !res.data) { return []; }
            return res.data.map((x: any,index:number) => ({id: x.marketId, name: x.marketName}));
        })).toPromise();
        return await userCountry;
    }
  printPdf(_base64): string {


    const byteArray = new Uint8Array(
      atob(_base64)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    const file = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = (window.URL || window.webkitURL).createObjectURL(file);
    fetch(fileURL)

    return fileURL;

  }
}
