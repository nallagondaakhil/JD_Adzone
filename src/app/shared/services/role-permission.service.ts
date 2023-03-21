import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
// import { RoleModel } from 'src/app/modules/admin/models/role.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  apiUrl = environment.apiBaseUrl;
  isActive = false;
  addFlag = false;
  permissionObj: any = {};
  subModuleSlug: string;
  constructor(private http: HttpClient) { }


  async getPermissionForModule(id: string,moduleName: string){
    const url = `${this.apiUrl}/api/v1/roleManagement/role/`+id;
    var permissionCheck;
    let res =  this.http.get<ApiResponse<any>>(url, {}).toPromise().then(res => {
      if (res.error?.erroCode) { return null; }
        return res?.data;
      });
      (await res)?.roleAccessControls.map((x:any)=>{
        // if(x.modules.slugName == moduleName && x.subModules.slugName == subModuleName){
        //   permissionCheck = x.isActive==1 ? true : false;
        // }
        if(x.modules.slugName == moduleName){
          this.subModuleSlug = x.subModules.slugName;
          this.permissionObj[this.subModuleSlug] = x.isActive==1 ? true : false;
        }
        
      })
      console.log(this.permissionObj)
      return true;
  }

  
  async getRoleById(subModuleName :string): Promise<any> {
    return this.permissionObj[subModuleName];
  }
}

