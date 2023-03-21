import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "src/app/core/services/user.service";
import { ApiResponse } from "src/app/modules/admin/models/paged-data.model";
import { environment } from "src/environments/environment";

@Injectable()
export class NavMenuService {
  baseApiUrl = environment.apiBaseUrl;
  baseuserApiUrl = environment.apiuserBaseUrl;

    constructor(private http: HttpClient,private userService:UserService) {
    }

    async getLeftMenuItems(): Promise<NavMenuModel[]> {
      const data='';
     const url = `${this.baseApiUrl}/v1/api/DocumentManagementService/getMenuList`;
      const res = await this.http.post<ApiResponse<NavMenuModel[]>>(url,data).toPromise();
      if (!res?.error) {
        return res?.data;
      } else {
        return [];
      }
        // return [
        //     {menuName: 'User Management',menuUrl:'/master/user-management'},
        //     {menuName: 'Role Management',menuUrl:'/master/role-management'},
        //     {menuName: 'Vendor Management',menuUrl:'/master/vendor-management'},
        //     {menuName: 'Document Category',menuUrl:'/master/document-category'},
        //     {menuName: 'Document Sub Category',menuUrl:'/master/document-sub-category'},
        //     // {menuName: 'Timeline Master'},
        //     // {menuName: 'Location Master'},
        //     {menuName: 'Document Name',menuUrl:'/master/document'},
        //     //{menuName: 'Upload Status'},
        //     //{menuName: 'Download Status'},
        //     //{menuName: 'Service Request'},
        //     //{menuName: 'My Claims'},
        // ];
    }

    async getLeftNewMenuItems(id: number,forceQueryFromServer:boolean = false): Promise<NavMenuModel[]> {
      //const data='';
      var roleId = this.userService.getUserRoleId();
     //const url = `${this.baseApiUrl}/v1/api/DocumentManagementService/getMenuList`;
     const url = `${this.baseuserApiUrl}/v1/api/MenuService/getSubMenuList?menuId=${id}&roleId=${roleId}`;
      const res = await this.http.post<ApiResponse<NavMenuModel[]>>(url,null).toPromise();
      if (!res?.error) {
        return res?.data;
      } else {
        return [];
      }
        // return [
        //     {menuName: 'User Management',menuUrl:'/master/user-management'},
        //     {menuName: 'Role Management',menuUrl:'/master/role-management'},
        //     {menuName: 'Vendor Management',menuUrl:'/master/vendor-management'},
        //     {menuName: 'Document Category',menuUrl:'/master/document-category'},
        //     {menuName: 'Document Sub Category',menuUrl:'/master/document-sub-category'},
        //     // {menuName: 'Timeline Master'},
        //     // {menuName: 'Location Master'},
        //     {menuName: 'Document Name',menuUrl:'/master/document'},
        //     //{menuName: 'Upload Status'},
        //     //{menuName: 'Download Status'},
        //     //{menuName: 'Service Request'},
        //     //{menuName: 'My Claims'},
        // ];
    }

    async getLeftcartMenuItems(): Promise<NavMenuModel[]> {
      const cartMenu =[{subMenuId:1, subMenuName: "Documents", subMenuUrl: "/master/shopping-cart"}
      // ,{subMenuId:2, subMenuName: "Printable Material", subMenuUrl: "/master/printable-material"}
    ]
      return cartMenu;
       
    }
    async getLeftTemplateMenuItems(): Promise<NavMenuModel[]> {
      const cartMenu =[{subMenuId:1, subMenuName: "Templates", subMenuUrl: "/master/edit-template"}]
      return cartMenu;
       
    }
    async getLeftMyTemplateMenuItems(): Promise<NavMenuModel[]> {
      const cartMenu =[{subMenuId:1, subMenuName: "My Templates", subMenuUrl: "/master/my-templates"}]
      return cartMenu;
       
    }
    async getLeftContactUsMenuItems(): Promise<NavMenuModel[]> {
      const cartMenu =[{subMenuId:1, subMenuName: "Contact Us", subMenuUrl: "/master/contact-us"}]
      return cartMenu;
       
    }
    
    async getLeftDealerMenuItems(): Promise<NavMenuModel[]>{
      const cartMenu =[{subMenuId:1, subMenuName: "Dealer View", subMenuUrl: "/master/end-user-management"}];
      return cartMenu;
    }
    async getLeftorderMenuItems(): Promise<NavMenuModel[]> {
      const cartMenu =[{subMenuId:1, subMenuName: "My Orders", subMenuUrl: "/master/my-orders"}];
      return cartMenu;
       
    }
    async getLeftNotificationMenuItems(): Promise<NavMenuModel[]> {
      const notificationMenu =[{subMenuId:1, subMenuName: "Notification", subMenuUrl: "/master/notification"}];
      return notificationMenu;
       
    }
    
    async getLeftwishMenuItems(): Promise<NavMenuModel[]>{
      const cartMenu =[{subMenuId:1, subMenuName: "Wishlist", subMenuUrl: "/master/wish-list"}]
      return cartMenu;
    }
}



export interface NavMenuModel {
    id?: number;
    subMenuName: string;
    subMenuId?: number;
    displayText?: string;
    submenu?: NavMenuModel[];
    submenuId?: number;
    subMenuUrl?: string;
}
