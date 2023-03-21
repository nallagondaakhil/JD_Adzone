

import { UserService } from "src/app/core/services/user.service";
import { MasterDataModel } from "src/app/modules/admin/models/master-data.model";
import { MasterDataService } from "src/app/modules/admin/services/master-data.service";
import { DocumentTypeMasterModel } from "../../models/doc-type-master.model";
import { DocumentTypeService } from "../../services/doc-type.service";

export interface DocumentTypeView {
    multipleThumbnailResponseDto?:Array<{thumbnailFileName: string, thumbnailFileSize: string,thumbnailFileURL:string,thumbailDocumentId:string,checked:boolean}>;
    image?:string;
    fileType?:string;
    fileId?:number;
    fileName?:string;
    extensionType?:string;
    documentId?: number;
    documentCount?:number;
    documentName?: string;
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
    deleteFileIdList?: Array<{id: number, name: string}>;
    documentCategory?: {id: number, name: string};
    documentSubChildCategoryId?:Array<{id?: number, name?: string}>;
    documentSubCategoryId?:Array<{id: number, name: string}>;
    documentSubChildCategoryName?:string;
    documentSubChildFourthCategoryId?:Array<{id?: number, name: string}>;
    documentSubChildFourthCategoryName?:string;
    documentCategoryName?:string;
    documentCategoryId?:Array<{id: number, name: string}>;
    documentSubCategoryName?:string;
    uploadedDocs?:Array<{fileId?:number,fileName:string,fileUrl:string,createdDate?:string,createdBy?:string,inSearch?:boolean}>;
    thumbnailDocs?:Array<{fileId?:string,fileName:string,fileUrl:string}>
    thumbnailUrl?:string;
    thumbnailId?:string;
    thumbnailName?:string;
    // rejectionReason?:string;
    // publishStatus?:any;
    expiryDate?:[Date];
    editable:boolean,
    countries?: Array<{
        id: number,
        name: string,
    }>;
    regions?: Array<{
        id: number,
        name: string,
    }>;
    approval?: Array<{
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


export class DocTypeModelMapper {
    static async mapToViewModel(model: DocumentTypeMasterModel, service: DocumentTypeService): Promise<DocumentTypeView> {
        console.log('approvlastratus',model)
        function checkURL(url) {
            if((url?.match(/\.(jpeg|svg|bmp|jpg|gif|png|pdf|tiff|tif|webp)$/gi) != null)){
              return 'image';
            }else if(url?.match(/\.(mp4)$/gi) != null){
              return 'video';
            }
            else if(url?.match(/\.(mov)$/gi) != null){
               return 'video';
             }else if(url?.match(/\.(avi)$/gi) != null){
               return 'video';
             }else if(url?.match(/\.(ogg)$/gi) != null){
               return 'audio';
             }else if(url?.match(/\.(wmv)$/gi) != null){
               return 'video';
             }else if(url?.match(/\.(webm)$/gi) != null){
               return 'video';
             }else if(url?.match(/\.(mkv)$/gi) != null){
               return 'video';
             }
            else if(url?.match(/\.(mp3)$/gi) != null){
              return 'audio';
            }else if(url?.match(/\.(ai)$/gi) != null){
                return 'ai';
            }else if(url?.match(/\.(psd)$/gi) != null){
                return 'psd';
            }else if(url?.match(/\.(cdr)$/gi) != null){
                return 'cdr';
            }else if(url?.match(/\.(zip)$/gi) != null){
                return 'zip';
            }else if(url?.match(/\.(psp)$/gi) != null){
                return 'psp';
            }else if(url?.match(/\.(psb)$/gi) != null){
                return 'psb';
            }else if(url?.match(/\.(xlsx)$/gi) != null){
                return 'xlsx';
            }else if(url?.match(/\.(docx)$/gi) != null){
                return 'docx';
            }else if(url?.match(/\.(doc)$/gi) != null){
                return 'doc';
            }else if(url?.match(/\.(7z)$/gi) != null){
                return '7z';
            }else if(url?.match(/\.(xls)$/gi) != null){
                return 'xls';
            }else if(url?.match(/\.(jfif)$/gi) != null){
                return 'jfif';
            }else if(url?.match(/\.(indt)$/gi) != null){
                return 'indt';
            }else if(url?.match(/\.(inx)$/gi) != null){
                return 'inx';
            }else if(url?.match(/\.(indb)$/gi) != null){
                return 'indb';
            }else if(url?.match(/\.(indl)$/gi) != null){
                return 'indl';
            }else if(url?.match(/\.(indd)$/gi) != null){
                return 'indd';
            }else if(url?.match(/\.(html)$/gi) != null){
                return 'html';
            }
            
          }
        let fileTypeName:any;
          if(model.fileType){
            fileTypeName = checkURL(model.fileName)
        }
        return {
            multipleThumbnailResponseDto: [{thumbailDocumentId:model?.thumbailDocumentId,thumbnailFileURL:model?.thumbnailFileURL,thumbnailFileSize:model?.thumbnailFileSize,thumbnailFileName:model?.thumbnailFileName,checked:model?.checked}],
            extensionType:fileTypeName,
            fileType:model?.fileType,
            fileId:model?.fileId,
            fileName:model?.fileName,
            image:model?.thumbnailUrl,
            thumbnailUrl:model?.thumbnailUrl,
            createdBy: model?.createdBy,
            createdDate: model.createdDate,
            updatedBy: model.updatedBy,
            updatedDate: model.updatedDate,
            documentName: model?.documentName,
            documentId: model?.documentId,
            documentCount:model?.documentCount,
            activeFlag: model.activeFlag === 1 ? 'Active' : 'Inactive',
            documentSubChildCategoryId: [{id:model?.documentSubChildCategoryId,name:model?.documentSubChildCategoryName}],
            documentSubChildFourthCategoryId: [{id:model?.documentSubChildFourthCategoryId,name:model?.documentSubChildFourthCategoryName}],
            documentCategoryId: [{id:model.documentCategoryId,name:model.documentCategoryName}],
            documentSubCategoryId: [{id:model.documentSubCategoryId,name:model.documentSubCategoryName}],
            regionId: [{id:model.regionId,name:model.regionName}],
            subRegionId: [{id:model.subregionId,name:model.subregionName}],
            country: [{id:model.marketId,name:model.marketName}],
            deleteFileIdList: [{id:model.fileId,name:model.fileName}],
            deleteFlag:model.deleteFlag,
            expiryDate:model.expiryDate && [new Date(model.expiryDate)],
            thumbnailDocs: [{fileId:model.thumbnailId,fileName:model.thumbnailName,fileUrl:null}],
            editable:model.editable,
            // rejectionReason:model.rejectionReason,
            // publishStatus:model.publishStatus,
            uploadedDocs: model?.files?.map(x=>
                {
                    return  {fileId:x?.fileId, fileName:x?.fileName, fileUrl:x?.fileS3Url,createdDate:x?.createdDate,createdBy:x?.createdBy,inSearch:x?.inSearch}
                }),
            countries: model?.market?.map(x=>
                {
                    return  {id:x?.marketId, name:x?.marketName}
                }),
            regions: model?.region?.map(x=>
                {
                    return  {id:x?.regionId, name:x?.regionName}
                }),
                approval: model?.approval?.map(x=>
                    {
                        return  {id:x?.id, name:x?.name}
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

    static mapToModel(model: DocumentTypeView,userService: UserService): DocumentTypeMasterModel {
        console.log('approvlastratus',model)
        return {
            documentName: model?.documentName,
            documentId: model?.documentId,
            activeFlag: model.activeFlag === 'Active' ? 1 : 0,
            documentSubCategoryId: model?.documentSubCategoryId[0]?.id,
            documentSubChildFourthCategoryId:model?.documentSubChildFourthCategoryId && model?.documentSubChildFourthCategoryId.length && model?.documentSubChildFourthCategoryId[0]?.id || null,
            documentSubChildCategoryId: model?.documentSubChildCategoryId && model?.documentSubChildCategoryId.length && model?.documentSubChildCategoryId[0]?.id || null,
            createdBy: model?.createdBy,
            createdDate: model.createdDate,
            deleteFlag:model.deleteFlag,
            editable:model.editable,
            // rejectionReason:model.rejectionReason,
            // publishStatus:model.publishStatus,
            currentUser: userService.getRacfId(),
            thumbnailUrl: "Surya",
            expiryDate: model?.expiryDate && model.expiryDate[0].toISOString() || null,
            markets : model?.countries?.map(x=>
                {
                    return {marketId: x?.id, marketName:x?.name}
                }),
            // markets : model?.countries?.map(x=>
            //     {
            //         return {marketId: x?.id, marketName:x?.name}
            //     }),
            region: model?.regions?.map(x=>
                {
                    return {regionId: x?.id, regionName:x?.name}
                }),
                approval: model?.approval?.map(x=>
                    {
                        return {id: x?.id, name:x?.name}
                    }),
            subRegion: model?.subRegions?.map(x=>
                {
                    return {subRegionId: x?.id, subRegionName:x?.name}
                }),
            divisions: model?.divisions?.map(x=>
                {
                    return {divisionId: x?.id, divisionName:x?.name}
                }),
                deleteFileIdList: model?.deleteFileIdList?.map(x=>
                {
                    return {fileId: x?.id, fileName:x?.name}
                }),
        };
        
    };
    
}
