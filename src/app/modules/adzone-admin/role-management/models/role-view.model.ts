import { UserService } from "src/app/core/services/user.service";
import { mainModules, roleListModel, roleModel, subModules } from "../../models/role-master.model";
import { RoleService } from "../../services/role-management.service";

export interface roleViewModel {
    roleType?:Array<{roleTypeId: number, name: string}>;
    roleId?: number;
    roleName?: string;
    permission?: Array<RoleAccess>;
    deleteFlag?: number;
    activateFlag?:string;
}

export interface RoleAccess {
    
    deleteFlag?: number;
    moduleId?: number;
    modulesName?: string;
    
    slugName?:string;
    
    subModules?:Array<
        {
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
            isCheckedFlag: number;
            roleAccessControlId?: number;
        }
    >
    
}

export interface roleListViewModel {
    roleName?: string;
    roleType?:Array<{roleTypeId: number, name: string}>;
    roleId?:number;
    activateFlag?: string;
    createdBy?: string;
    createdDate?: string;
    deleteFlag?: number;
    updatedBy?: string;
    updatedDate?: string;
  }

export class RoleModelMapper {
    static async mapToViewModel(model: roleModel, service: RoleService): Promise<roleViewModel> {
        
        const mainModules:any = model?.roleAccessControls.map((x) => 
        {
            
            const subModules = x.subModules.map((x) => {
                return { 
                    activateFlag:x.activateFlag,
                    createdBy:x.createdBy,
                    createdDate:x.createdDate,
                    deleteFlag:x.deleteFlag,
                    updatedBy:x.updatedBy,
                    updatedDate:x.updatedDate,
                    modules_id:x.modules_id,
                    slugName:x.slugName,
                    subModulesName:x.subModulesName,
                    subModulesId:x.subModulesId,
                    isCheckedFlag: x.isCheckedFlag,
                    roleId: model.roleId,
                    roleName: model.roleName,
                    roleAccessControlId: x.roleAccessControlId,
                }
            })
            return { 
                // activateFlag:x.activateFlag,
                // createdBy:x.createdBy,
                // createdDate:x.createdDate,
                // deleteFlag:x.deleteFlag,
                // updatedBy:x.updatedBy,
                // updatedDate:x.updatedDate,
                // modules_id:x.modules_id,
                // slugName:x.slugName,
                // subModulesName:x.subModulesName,
                // subModulesId:x.subModulesId,
                // isCheckedFlag: 1,
                moduleId: x?.moduleId,
                modulesName: x?.modulesName,
                slugName: x?.slugName,
                deleteFlag: x?.deleteFlag,
                // roleName:model.roleName,
                // roleId:model.roleId,
                subModules: subModules,
                
            }
            
        }
        );
        return{
            roleId: model.roleId,
            roleType:model.roleType,
            roleName: model.roleName,
            permission: mainModules,
        }
        
    }   

    static mapToModel(model: roleViewModel,userService: UserService): roleModel {
        const accessControl = [];
        model.permission.forEach((mainMod) => 
        {
            mainMod.subModules.forEach((x) => {
                accessControl.push({
                    activateFlag:x.activateFlag,
                    createdBy:x.createdBy,
                    createdDate:x.createdDate,
                    deleteFlag:x.deleteFlag,
                    updatedBy:x.updatedBy,
                    updatedDate:x.updatedDate,
                    slugName:x.slugName,
                    subModulesName:x.subModulesName,
                    subModulesId:x.subModulesId,
                    isCheckedFlag: x.isCheckedFlag ? 1 : 0, 
                    moduleId: mainMod?.moduleId,
                    modulesName: mainMod?.modulesName,
                    roleAccessControlId: x.roleAccessControlId,
                })
            })
            // mainModules.push({ 
            //     // modulesId: mainMod?.modulesId,
            //     // modulesName: mainMod?.modulesName,
            //     // slugName: mainMod?.slugName,
            //     // deleteFlag: mainMod?.deleteFlag,
            //     // subModules: subModules,
            //     subModules
                
            // }) 
        }
        );
        return {
            roleType:model?.roleType[0].name,
            roleId: model?.roleId || null,
            roleName: model?.roleName || '',
            deleteFlag: model?.deleteFlag,
            roleAccessControls: accessControl,
            activateFlag: 1,
            currentUser: userService.getRacfId(),
        };
    }

    
}

export class RoleModelListMapper {
    static async mapToViewModel(model: roleListModel, service: RoleService): Promise<roleListViewModel> {
        return{
            roleId: model.roleId,
            roleName: model.roleName,
            roleType: model.roleType == "Dashboard View Access" ? [{roleTypeId: 1, name: model.roleType}] : [{roleTypeId: 2, name: model.roleType}],
            createdBy:model.createdBy,
            createdDate:model.createdDate,
            updatedDate:model.updatedDate,
            activateFlag:model.activateFlag === 1 ? 'Active' : 'Inactive',
        }
    }   

    static mapToModel(model: roleListViewModel): roleListModel {
        return {
            roleId: model?.roleId || null,
            roleName: model?.roleName || '',
            deleteFlag: model?.deleteFlag,
            activateFlag: model.activateFlag === 'Active' ? 1 : 0,
        };
    }

    
}