import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { roleModel } from '../models/role-master.model';
import { RoleModelListMapper, RoleModelMapper } from '../role-management/models/role-view.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  apiUrl = environment.apiuserBaseUrl;
  apiNewUrl = environment.apiuserBaseUrl;
  isActive = false;
  addFlag = false;
  permissionObj: any = {};
  permissionView:any={};
  permissionViewAccess:string;
  subModuleSlug: string;
  checkDealview = true;
  checkMenuAccess = true;
  constructor(private http: HttpClient,private userService : UserService) { }

  async getPermissionForModule(id: string,moduleName: string){
    //console.log(id,moduleName);
    const url = `${this.apiUrl}/v1/api/roleacces/roleId/`+id;
    var permissionCheck;
    let ress =  this.http.get<ApiResponse<any>>(url, {}).toPromise().then(async res => {
      if (res.error?.erroCode) { return null; }
      
        return await res?.data;
      });
      (await ress)?.map((x:any)=>{
        this.permissionViewAccess="roleType";
        //console.log(x);
        this.permissionView[this.permissionViewAccess]=x.roleType;
        if(x.modulesName == moduleName){
        
          (x.subModules.map((data:any)=>{
            
            this.subModuleSlug = data.slugName;
            this.permissionObj[this.subModuleSlug] = data.isCheckedFlag==1 ? true : false;
          }));
         } 
      })
      //console.log(this.permissionObj);
      //console.log(this.permissionView)
      return true;
    
  }

  
  async getRoleById(subModuleName :string): Promise<any> {
    console.log(subModuleName);
    return this.permissionObj[subModuleName];
  }
  async getRoleViewAccess(): Promise<any> {
    //console.log( this.permissionView)
    return this.permissionView;
  }
}
