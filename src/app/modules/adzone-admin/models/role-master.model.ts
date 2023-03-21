export interface subModules {
    activateFlag?: number;
    createdBy?: string;
    createdDate?: string;
    deleteFlag?: number;
    updatedBy?: string;
    updatedDate?: string;
    modules_id?:number;
    slugName?:string;
    subModulesName?:string;
    subModulesId?:string;
    moduleId?: number;
    modulesName?: string;
    isCheckedFlag?: number;
    roleAccessControlId?:number;
}

export interface mainModules {
  moduleId?: number;
  modulesName?: string;
  slugName?:string;
  deleteFlag?: number;
  
  subModules?: Array<subModules>
  
}

export interface roleModel {
    roleType?:any;
    roleName?: string;
    roleId?:number;
    roleAccessControls?: Array<mainModules>;
    deleteFlag?: number;
    activateFlag?:number;
    currentUser?: string;
}

export interface roleListModel {
  roleName?: string;
  roleType?:string;
  roleId?:number;
  activateFlag?: number;
  createdBy?: string;
    createdDate?: string;
    deleteFlag?: number;
    updatedBy?: string;
    updatedDate?: string;
}