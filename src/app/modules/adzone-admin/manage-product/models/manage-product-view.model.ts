import { UserService } from "src/app/core/services/user.service";
import { ManageProductMasterModel } from "../../models/manage-product-master.model";
import { ManageProductService } from "../../services/manage-product.service";

export class ManageProductView {
    documentId?: number;
    productId?:string;
    documentName?: string;
    specification?:string;
    price?:string;
    currency?:string;
    activeFlag?: string;
    createdDate?: string;
    updatedDate?: string;
    createdBy?: string;
    updatedBy?: string;
    isEdit?:number;
    isActive?: number;
    status?: string;
    files?: Array<{fileName: string, fileUrl: string}>;
    file?: Array<{fileName: string, fileUrl: string}>;
    regionId?: Array<{id: number, name: string}>;
    subRegionId?: Array<{id: number, name: string}>;
    country?: Array<{id: number, name: string}>;
    documentCategory?: {id: number, name: string};
    documentSubChildCategoryId?:Array<{id?: number, name?: string}>;
    documentSubCategoryId?:Array<{id: number, name: string}>;
    documentSubChildCategoryName?:string;
    documentCategoryName?:string;
    documentCategoryId?:Array<{id: number, name: string}>;
    documentSubCategoryName?:string;
    uploadedDocs?:Array<{fileId?:number,fileName:string,fileUrl:string}>;
    thumbnailDocs?:Array<{fileId?:string,fileName:string,fileUrl:string}>
    thumbnailUrl?:string;
    thumbnailId?:string;
    thumbnailName?:string;
    productSearch?:string;
    expiryDate?:[Date];;
    displayExpiryDate?:string;
    countries?: Array<{
        id: number,
        name: string,
    }>;
    regions?: Array<{
        id: number,
        name: string,
    }>;
    subRegions?: Array<{
        id: number,
        name: string,
    }>;
    deleteFlag?:number;
    divisions?: Array<{
        id: number,
        name: string,
    }>;
}
export interface FileUplodResult {
    referenceDocDetailId: number;
    referenceDocName: string;
    fileUrl: string;
}
export class ManageProductModelMapper {
    static async mapToViewModel(model: ManageProductMasterModel, service: ManageProductService): Promise<ManageProductView> {
        function formatDate(date) {
            if(date){
                var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                
                return [day, month, year].join('-');
            }else{
                return "-";
            }
            
        }
        return {
            createdBy: model?.createdBy,
            createdDate: model.createdDate,
            updatedBy: model.updatedBy,
            updatedDate: model.updatedDate,
            documentName: model?.documentName,
            documentId: model?.documentId,
            specification:model?.specification,
            price:model?.price,
            currency:model?.currency,
            activeFlag: model.activeFlag === 1 ? 'Active' : 'Inactive',
            documentSubChildCategoryId: [{id:model?.documentSubChildCategoryId,name:model?.documentSubChildCategoryName}],
            documentCategoryId: [{id:model.documentCategoryId,name:model.documentCategoryName}],
            documentSubCategoryId: [{id:model.documentSubCategoryId,name:model.documentSubCategoryName}],
            regionId: [{id:model.regionId,name:model.regionName}],
            subRegionId: [{id:model.subregionId,name:model.subregionName}],
            country: [{id:model.marketId,name:model.marketName}],
            deleteFlag:model.deleteFlag,
            thumbnailUrl:model?.thumbnailUrl,
            expiryDate:model.expiryDate && [new Date(model.expiryDate)],
            displayExpiryDate: formatDate(model?.expiryDate),
            thumbnailDocs: [{fileId:model.thumbnailId,fileName:model.thumbnailName,fileUrl:null}],
            uploadedDocs: model?.files?.map(x=>
                {
                    return  {fileId:x?.fileId, fileName:x?.fileName, fileUrl:x?.fileS3Url}
                }),
            countries: model?.market?.map(x=>
                {
                    return  {id:x?.marketId, name:x?.marketName}
                }),
            regions: model?.region?.map(x=>
                {
                    return  {id:x?.regionId, name:x?.regionName}
                }),
            subRegions: model?.subRegion?.map(x=>
                {
                    return  {id:x?.subRegionId, name:x?.subRegionName}
                }),
            divisions: model?.division?.map(x=>
                {
                    return  {id:x?.divisionId, name:x?.divisionName}
                }),
        };
    }

    static mapToModel(model: ManageProductView,userService: UserService): ManageProductMasterModel {
        console.log(model)
        return {
            documentName: model?.documentName,
            documentId: model?.documentId,
            activeFlag: model.activeFlag === 'Active' ? 1 : 0,
            documentSubCategoryId: model?.documentSubCategoryId[0]?.id,
            documentSubChildCategoryId: model?.documentSubChildCategoryId && model?.documentSubChildCategoryId.length && model?.documentSubChildCategoryId[0]?.id || null,
            createdBy: model?.createdBy,
            createdDate: model.createdDate,
            deleteFlag:model.deleteFlag,
            specification:model.specification,
            price:model.price,
            currency:model.currency,
            expiryDate: model?.expiryDate && model.expiryDate[0].toISOString() || null,
            currentUser: userService.getRacfId(),
            thumbnailUrl: "Surya",
            markets : model?.countries?.map(x=>
                {
                    return {marketId: x?.id, marketName:x?.name}
                }),
            region: model?.regions?.map(x=>
                {
                    return {regionId: x?.id, regionName:x?.name}
                }),
            subRegion: model?.subRegions?.map(x=>
                {
                    return {subRegionId: x?.id, subRegionName:x?.name}
                }),
            divisions: model?.divisions?.map(x=>
                {
                    return {divisionId: x?.id, divisionName:x?.name}
                }),
        };
      
    };
    
}