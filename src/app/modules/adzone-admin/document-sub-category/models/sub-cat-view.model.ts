import { UserService } from "src/app/core/services/user.service";
import { MasterDataService } from "src/app/modules/admin/services/master-data.service";
import { SubCatMaster } from "../../models/sub-cat-master.model";
import { SubCatService } from "../../services/sub-cat.service";

export class SubCatView {
    documentSubCategoryId?: string;
    //documentCategoryId?: string;
    //documentCategory?: string;
    documentCategoryName?:string;
    documentSubCategoryName?:string;
    //category2?:string;
    deleteFlag?: number;
    activeFlag?: string;
    createdDate?:string;
    updatedDate?:string;
    createdBy?:string;
    updatedBy?:string;
    status?:string;
    isEdit?: number;
    isActive?:number;
    documentCategoryId?:Array<{id: number, name: string}>;
    childFourthCategoryId:Array<{ documentSubChildCategoryId:number,
        documentSubChildCategoryName:string,
        deleteFlag:number,
        documentSubChildFourthCategoryId:number,
        documentSubChildFourthCategoryName:string,}>;
    documentSubChildCategory:Array<{
        documentSubChildCategoryId?:number,
        documentSubChildCategoryName?:string,
        deleteFlag?:number,
        childFourthCategory:Array<{
            documentSubChildFourthCategoryId?:number,
            documentSubChildFourthCategoryName?:string,
            deleteFlag?:number,
            
        }>;
    }>;
   
}

export class SubCatMasterModelMapper {
    static async mapToViewModel(model: SubCatMaster,service: SubCatService): Promise<SubCatView> {
        const documentSubChildCategory = model.documentSubChildCategory && model.documentSubChildCategory.map(x=>{
            return {
                documentSubChildCategoryId:x.documentSubChildCategoryId,
                documentSubChildCategoryName:x.documentSubChildCategoryName,
                deleteFlag:x.deleteFlag,
                childFourthCategoryId:x.childFourthCategory,
                childFourthCategory:
                x.childFourthCategory.map(x=>{
                    return {
                        documentSubChildFourthCategoryId:x.documentSubChildFourthCategoryId,
                        documentSubChildFourthCategoryName:x.documentSubChildFourthCategoryName,
                        deleteFlag:x.deleteFlag,
                    }
                })
            }

        })
        const docSubID = await service.getCategory(model.documentCategoryId);
        
        return {
            //activityExpenses:activityExpenses?.length?activityExpenses:[], 
            documentSubChildCategory:documentSubChildCategory,
            createdBy: model?.createdBy,
            //documentCategory:model?.documentCategory,
            createdDate: model?.createdDate,
            updatedBy: model?.updatedBy,
            updatedDate: model?.updatedDate,
            documentSubCategoryName:model?.documentSubCategoryName,
            documentCategoryName:model?.documentCategoryName,
            //category2:model?.category2,
            documentSubCategoryId: model?.documentSubCategoryId,
            childFourthCategoryId:model?.childFourthCategory,

            //documentCategoryId: model?.documentCategoryId,
            documentCategoryId: [docSubID],
            deleteFlag:model.deleteFlag,
            activeFlag: model.activeFlag === 1 ? 'Active' : 'Inactive',
            // selectedRole: model?.emailRoleMapping?.map(x=>
            // {
            //     return  {id:x?.roleId, name:x?.roles?.name,mappingId: x?.mappingId,emailTemplateId: x?.emailTemplateId}
                
            // }),
            // emailRoleMapping: model?.emailRoleMapping,
            // {
                // mappingId: model.mappingId,
                // emailTemplateId: model.emailTemplateId,
                // roleId: model.roleId,
                // roles: model.roles?.map(x=>
                // {
                //     return  {id:x.roleId, name:x.roles.name, emailTemplateId:x.emailTemplateId}
                    
                //  }),
            // },
        };
    }
    static mapToModel(model: SubCatView,userService: UserService): SubCatMaster {
        const documentSubChildCategory = model.documentSubChildCategory && model.documentSubChildCategory.map(x=>{
            return {
                documentSubChildCategoryId:x?.documentSubChildCategoryId,
                documentSubChildCategoryName:x?.documentSubChildCategoryName,
                deleteFlag:x?.deleteFlag,
                childFourthCategoryId:x.childFourthCategory,
                childFourthCategory:
                x.childFourthCategory.map(x=>{
                    return {
                        documentSubChildFourthCategoryId:x.documentSubChildFourthCategoryId,
                        documentSubChildFourthCategoryName:x.documentSubChildFourthCategoryName,
                        deleteFlag:x.deleteFlag,
                    }
                })
            }

        })
        return {
            childFourthCategory:model?.childFourthCategoryId,
            documentSubChildCategory:documentSubChildCategory || [],
            documentSubCategoryId: model?.documentSubCategoryId,
            documentSubCategoryName:model?.documentSubCategoryName,
            documentCategoryId: model?.documentCategoryId[0].id,
            createdBy:model?.createdBy,
            //documentCategoryName?.model?.documentCategoryName,
            //updatedBy:model?.updatedBy,
            createdDate:model?.createdDate,
            deleteFlag:model?.deleteFlag,
            //documentCategoryName: model.documentCategoryId,
            //documentCategory: model?.documentCategory,
            activeFlag: model.activeFlag === 'Active' ? 1 : 0,
            currentUser: userService.getRacfId(),
            
        };
    }

    
}
